import { useDispatch, useSelector } from "react-redux";
import { create_open_conversation } from "../../../features/chatSlice";
import SocketContext from "../../../contexts/SocketContext";
import * as cryptoUtils from '../../../utils/crypto';
import { sendFriendRequest, getOutgoingRequests, acceptFriendRequest, getPendingRequests } from '../../../features/friendRequestSlice';

function Contact({ contact, setSearchResults, socket }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { token } = user;
  const { conversations } = useSelector((state) => state.chat);
  const { outgoing, pending } = useSelector((state) => state.friendRequest);

  // Check if already a friend (conversation exists)
  const isFriend = conversations.some(
    convo =>
      convo.users.some(u => u._id === contact._id) &&
      convo.users.some(u => u._id === user._id)
  );

  // Check if already in outgoing pending requests
  const isPendingOutgoing = outgoing.some(req => req.receiver._id === contact._id);

  // Check if there is an incoming pending request from this contact
  const incomingRequest = pending.find(req => req.sender._id === contact._id);

  const handleInvite = async () => {
    // 1. Generate DH and RSA key pairs
    const dhKeyPair = await cryptoUtils.generateDHKeyPair();
    const rsaKeyPair = await cryptoUtils.generateRSAKeyPair();
    // 2. Export public keys
    const dhPublicJwk = await cryptoUtils.exportDHPublicKey(dhKeyPair.publicKey);
    const rsaPublicJwk = await cryptoUtils.exportRSAPublicKey(rsaKeyPair.publicKey);
    // 3. Export private keys (for later use)
    const dhPrivateJwk = await window.crypto.subtle.exportKey('jwk', dhKeyPair.privateKey);
    const rsaPrivateJwk = await cryptoUtils.exportRSAPrivateKey(rsaKeyPair.privateKey);
    sessionStorage.setItem('dhPrivateKey', JSON.stringify(dhPrivateJwk));
    sessionStorage.setItem('rsaPrivateKey', JSON.stringify(rsaPrivateJwk));
    // 4. Send friend request with public keys
    await dispatch(sendFriendRequest({
      token,
      receiver: contact._id,
      dhPublicKey: JSON.stringify(dhPublicJwk),
      rsaPublicKey: JSON.stringify(rsaPublicJwk)
    }));
    dispatch(getOutgoingRequests(token));
  };

  const handleAccept = async (requestId) => {
    // 1. Generate DH and RSA key pairs
    const dhKeyPair = await cryptoUtils.generateDHKeyPair();
    const rsaKeyPair = await cryptoUtils.generateRSAKeyPair();
    // 2. Export public keys
    const dhPublicJwk = await cryptoUtils.exportDHPublicKey(dhKeyPair.publicKey);
    const rsaPublicJwk = await cryptoUtils.exportRSAPublicKey(rsaKeyPair.publicKey);
    // 3. Export private keys (for later use)
    const dhPrivateJwk = await window.crypto.subtle.exportKey('jwk', dhKeyPair.privateKey);
    const rsaPrivateJwk = await cryptoUtils.exportRSAPrivateKey(rsaKeyPair.privateKey);
    sessionStorage.setItem('dhPrivateKey', JSON.stringify(dhPrivateJwk));
    sessionStorage.setItem('rsaPrivateKey', JSON.stringify(rsaPrivateJwk));
    // 4. Accept the request
    await dispatch(acceptFriendRequest({
      token,
      requestId,
      dhPublicKey: JSON.stringify(dhPublicJwk),
      rsaPublicKey: JSON.stringify(rsaPublicJwk)
    }));
    dispatch(getPendingRequests(token));
    setSearchResults([]);
  };

  const handleChat = () => {
    const convo = conversations.find(
      c => c.users.some(u => u._id === contact._id) && c.users.some(u => u._id === user._id)
    );
    if (convo) {
      dispatch({ type: 'chat/setActiveConversation', payload: convo });
      socket.emit("join_conversation", convo._id);
      setSearchResults([]);
    }
  };

  return (
    <>
      <li className="list-none h-[72px] hover:dark:bg-dark_bg_2 cursor-pointer dark:text-dark_text_1 px-[10px]">
        {/*Container*/}
        <div className="flex items-center gap-x-3 py-[10px]">
          {/*Contact infos*/}
          <div className="flex items-center gap-x-3">
            {/*Conversation user picture*/}
            <div className="relative min-w-[50px] max-w-[50px] h-[50px] rounded-full overflow-hidden">
              <img
                src={contact.picture}
                alt={contact.name}
                className="w-full h-full object-cover "
              />
            </div>
            {/*Conversation name and message*/}
            <div className="w-full flex flex-col">
              {/*Conversation name*/}
              <h1 className="font-bold flex items-center gap-x-2">
                {contact.name}
              </h1>
              {/* Conversation status */}
              <div>
                <div className="flex items-center gap-x-1 dark:text-dark_text_2">
                  <div className="flex-1 items-center gap-x-1 dark:text-dark_text_2">
                    <p>{contact.status}</p>
                  </div>
                </div>
                <div className="mt-2">
                  {isFriend ? (
                    <button className="btn btn-primary" onClick={handleChat}>Chat</button>
                  ) : incomingRequest ? (
                    <button className="btn btn-success" onClick={() => handleAccept(incomingRequest._id)}>Accept</button>
                  ) : isPendingOutgoing ? (
                    <button className="btn btn-secondary" disabled>Pending</button>
                  ) : (
                    <button className="btn btn-success" onClick={handleInvite}>Invite</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*Border*/}
        <div className="ml-16 border-b dark:border-b-dark_border_1"></div>
      </li>
    </>
  );
}

const ContactWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <Contact {...props} socket={socket} />}
  </SocketContext.Consumer>
);
export default ContactWithSocket;
