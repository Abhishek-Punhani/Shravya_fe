import { useDispatch, useSelector } from "react-redux";
import { Sidebar } from "../components/sidebar";
import { useEffect, useState } from "react";
import {
  endCall,
  getConversations,
  setIncomingCall,
  updateDeleteMessages,
  updateEditedMessage,
  updateMessages,
  addConversation,
  setActiveConversation,
} from "../features/chatSlice";
import { ChatContainer, WelcomeHome } from "../components/chat";
import SocketContext from "../contexts/SocketContext";
import Call from "../components/chat/call/Call";
import * as cryptoUtils from '../utils/crypto';
import { getPendingRequests, getOutgoingRequests } from "../features/friendRequestSlice";

function Home({ socket }) {
  const [showPicker, setShowPicker] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typing, setTyping] = useState({});
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { activeConversation, conversations } = useSelector((state) => state.chat);
  const [totalSecInCall, setTotalSecInCall] = useState(0);
  const [show, setShow] = useState(undefined);
  const [showMenu, setShowMenu] = useState(false);
  // join event for socket io
  // join user into the socket io
  useEffect(() => {
    socket.emit("join", user._id);
    // get online users
    socket.on("get-online-users", (users) => {
      setOnlineUsers(users);
    });

    // --- FRIEND REQUEST SOCKET EVENTS ---
    const handleFriendRequestSent = () => {
      if (user?.token) {
        dispatch(getPendingRequests(user.token));
      }
    };
    const handleConversationCreated = ({ conversation }) => {
      if (conversation) {
        console.log('🔄 Conversation created:', conversation._id);
        dispatch(addConversation(conversation));
        
        // Move keys from temp storage to actual conversation ID
        const tempKey = `temp_${user._id}`;
        const storedKeys = cryptoUtils.getKeys(tempKey);
        if (storedKeys) {
          console.log('🔄 Moving keys from temp storage to conversation:', conversation._id);
          cryptoUtils.storeKeys(conversation._id, storedKeys.dhPrivateJwk, storedKeys.rsaPrivateJwk);
          cryptoUtils.clearKeys(tempKey);
        }
      }
    };
    const handleFriendRequestAccepted = ({ conversation }) => {
      if (user?.token) {
        dispatch(getPendingRequests(user.token));
        dispatch(getOutgoingRequests(user.token));
      }
      if (conversation) {
        dispatch(addConversation(conversation));
        // Optionally set as active conversation:
        // dispatch(setActiveConversation(conversation));
      }
    };
    socket.on("friend_request_sent", handleFriendRequestSent);
    socket.on("conversation_created", handleConversationCreated);
    socket.on("friend_request_accepted", handleFriendRequestAccepted);
    // Cleanup
    return () => {
      socket.off("friend_request_sent", handleFriendRequestSent);
      socket.off("conversation_created", handleConversationCreated);
      socket.off("friend_request_accepted", handleFriendRequestAccepted);
    };
  }, [user, dispatch, socket]);

  // get conversations
  useEffect(() => {
    if (user?.token) dispatch(getConversations(user.token));
  }, [user, dispatch]);

  // message and typing
  useEffect(() => {
    socket.on("message_received", async (message) => {
      console.log('Received message:', message);
      // --- E2EE: Decrypt message before dispatching ---
      try {
        // Get the full conversation with keys from Redux state
        const fullConversation = conversations.find(c => c._id === message.conversation._id);
        console.log('Full conversation from Redux:', fullConversation);
        
        if (!fullConversation || !fullConversation.keys) {
          console.log('No full conversation or keys found in Redux');
          await dispatch(updateMessages(message)); // fallback: no decryption
          return;
        }
        
        const conversation = fullConversation;
        const myId = user._id;
        const myKeyEntry = conversation.keys && conversation.keys.find(k => k.userId === myId);
        const peerKeyEntry = conversation.keys && conversation.keys.find(k => k.userId !== myId);
        console.log('conversation.keys:', conversation.keys);
        console.log('myKeyEntry:', myKeyEntry);
        console.log('peerKeyEntry:', peerKeyEntry);
        if (!myKeyEntry || !peerKeyEntry) {
          console.log('Missing key entry:', { myKeyEntry, peerKeyEntry });
          await dispatch(updateMessages(message)); // fallback: no decryption
          return;
        }
        // 1. Get my encrypted RSA private key and IV
        const encryptedRsaPrivateKeyB64 = myKeyEntry.encryptedRsaPrivateKey;
        const ivB64 = myKeyEntry.iv;
        console.log('encryptedRsaPrivateKeyB64:', encryptedRsaPrivateKeyB64);
        console.log('ivB64:', ivB64);
        // 2. Get my DH private key from storage
        let dhPrivateJwk;
        try {
          console.log('🔍 Looking for keys for conversation:', conversation._id);
          const storedKeys = cryptoUtils.getKeys(conversation._id);
          if (storedKeys) {
            console.log('✅ Found keys in localStorage', storedKeys);
            dhPrivateJwk = storedKeys.dhPrivateJwk;
          } else {
            console.log('⚠️ Keys not in localStorage, checking sessionStorage');
            dhPrivateJwk = JSON.parse(sessionStorage.getItem('dhPrivateKey'));
            if (dhPrivateJwk) {
              console.log('✅ Found keys in sessionStorage', dhPrivateJwk);
            } else {
              console.log('❌ No keys found anywhere');
            }
          }
          console.log('dhPrivateJwk:', dhPrivateJwk);
        } catch (err) {
          console.error('Failed to get DH private key:', err);
          await dispatch(updateMessages(message)); // fallback: no decryption
          return;
        }
        
        let dhPrivateKey;
        try {
          dhPrivateKey = await cryptoUtils.importDHPrivateKey(dhPrivateJwk);
          console.log('Imported DH private key:', dhPrivateKey);
        } catch (err) {
          console.error('Failed to import DH private key:', err);
          await dispatch(updateMessages(message)); // fallback: no decryption
          return;
        }
        // 3. Get peer's DH public key
        const peerDhPublicJwk = JSON.parse(peerKeyEntry.dhPublicKey);
        console.log('peerDhPublicJwk:', peerDhPublicJwk);
        let peerDhPublicKey;
        try {
          peerDhPublicKey = await cryptoUtils.importDHPublicKey(peerDhPublicJwk);
          console.log('Imported peer DH public key:', peerDhPublicKey);
        } catch (err) {
          console.error('Failed to import peer DH public key:', err);
          throw err;
        }
        // 4. Derive shared secret
        let aesKey;
        try {
          aesKey = await cryptoUtils.deriveSharedSecret(dhPrivateKey, peerDhPublicKey);
          console.log('Derived AES key:', aesKey);
        } catch (err) {
          console.error('Failed to derive shared secret:', err);
          throw err;
        }
        // 5. Decrypt my RSA private key
        let rsaPrivateJwkStr;
        try {
          const encryptedRsaPrivateKey = Uint8Array.from(atob(encryptedRsaPrivateKeyB64), c => c.charCodeAt(0));
          const iv = Uint8Array.from(atob(ivB64), c => c.charCodeAt(0));
          rsaPrivateJwkStr = await cryptoUtils.decryptWithAESGCM(aesKey, encryptedRsaPrivateKey.buffer, iv);
          console.log('Decrypted RSA private JWK string:', rsaPrivateJwkStr);
        } catch (err) {
          console.error('Failed to decrypt RSA private key:', err);
          throw err;
        }
        let rsaPrivateJwk, rsaPrivateKey;
        try {
          rsaPrivateJwk = JSON.parse(rsaPrivateJwkStr);
          console.log('Parsed RSA private JWK:', rsaPrivateJwk);
          rsaPrivateKey = await cryptoUtils.importRSAPrivateKey(rsaPrivateJwk);
          console.log('Imported RSA private key:', rsaPrivateKey);
        } catch (err) {
          console.error('Failed to import RSA private key:', err);
          throw err;
        }
        // 6. Decrypt the message
        try {
          const encryptedMsgB64 = message.message;
          const encryptedMsg = Uint8Array.from(atob(encryptedMsgB64), c => c.charCodeAt(0));
          console.log('Attempting to decrypt message with RSA private key...');
          const decryptedMsg = await cryptoUtils.decryptWithRSAPrivateKey(rsaPrivateKey, encryptedMsg.buffer);
          console.log('Decrypted message:', decryptedMsg);
          message.message = decryptedMsg;
        } catch (err) {
          console.error('Failed to decrypt message:', err);
          throw err;
        }
        await dispatch(updateMessages(message));
      } catch (err) {
        console.error('E2EE decryption failed:', err);
        await dispatch(updateMessages(message)); // fallback: show as-is
      }
    });
    // Listening typing..
    socket.on("typing", (conversation) => setTyping(conversation));
    socket.on("stop_typing", (conversation) => setTyping(conversation));
    // edited
    socket.on("editMsg", async (msg) => {
      await dispatch(updateEditedMessage(msg));
    });
    // delete Message
    socket.on("deleteMsg", async (msg) => {
      console.log(msg);
      await dispatch(updateDeleteMessages(msg));
    });
  }, [conversations, user, dispatch]);

  // call
  useEffect(() => {
    socket.on("incoming-call", ({ from, callType, signal }) => {
      dispatch(
        setIncomingCall({
          ...from,
          callType,
          signal,
        })
      );
    });
    socket.on("call-rejected", async () => {
      setTotalSecInCall(0);
      console.log("ending Call");
      await dispatch(endCall());
    });
  }, []);

  return (
    <>
      <div
        className="min-h-screen dark:bg-dark_bg_1 flex items-center justify-center "
        onClick={() => {
          if (show) {
            setShow(false);
          }
          if (showMenu) {
            setShowMenu(false);
          }
          if (showPicker) {
            setShowPicker(false);
          }
        }}
      >
        {/* Container */}
        <div className="container min-h-screen h-full flex min-w-full">
          {/* Sidebar */}

          <Sidebar
            onlineUsers={onlineUsers}
            typing={typing}
            show={show}
            setShow={setShow}
            showMenu={showMenu}
            setShowMenu={setShowMenu}
            showPicker={showPicker}
            setShowPicker={setShowPicker}
          />
          {/* Main Chat Component */}
          <div className="flex-1">
            {activeConversation && activeConversation?._id ? (
              <ChatContainer
                onlineUsers={onlineUsers}
                typing={typing}
                showPicker={showPicker}
                showAttachments={showAttachments}
                setShowPicker={setShowPicker}
                setShowAttachments={setShowAttachments}
              />
            ) : (
              <WelcomeHome />
            )}
          </div>
        </div>
      </div>
      {/* Call */}
      {(call || incomingCall) && (
        <div>
          <Call
            totalSecInCall={totalSecInCall}
            setTotalSecInCall={setTotalSecInCall}
          />
        </div>
      )}
    </>
  );
}

const HomeWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <Home {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default HomeWithSocket;
