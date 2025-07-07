import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getPendingRequests, getOutgoingRequests, acceptFriendRequest } from '../../../features/friendRequestSlice';
import * as cryptoUtils from '../../../utils/crypto';

function PendingRequests() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);
  const { pending, outgoing, status } = useSelector(state => state.friendRequest);

  useEffect(() => {
    if (user?.token) {
      dispatch(getPendingRequests(user.token));
      dispatch(getOutgoingRequests(user.token));
    }
  }, [user, dispatch]);

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
      token: user.token,
      requestId,
      dhPublicKey: JSON.stringify(dhPublicJwk),
      rsaPublicKey: JSON.stringify(rsaPublicJwk)
    }));
    // Re-fetch both lists
    dispatch(getPendingRequests(user.token));
    dispatch(getOutgoingRequests(user.token));
  };

  if (status === "loading") return <div>Loading requests...</div>;

  // Remove outgoing requests that are now friends (i.e., have a conversation)
  // This is handled by backend deleting the request, but we re-fetch both lists after accept

  return (
    <div className="pending-requests px-2">
      <h2 className="font-bold text-lg mb-2 text-green-400">Pending Friend Requests</h2>
      {pending.length === 0 && outgoing.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-gray-400">
          <img src="/default.svg" alt="No pending" className="w-16 h-16 mb-2 opacity-60" />
          <span className="text-md font-semibold">No pending requests</span>
        </div>
      ) : (
        <ul className="space-y-3">
          {/* Incoming requests (can accept) */}
          {pending.map(req => (
            <li key={req._id} className="flex items-center bg-dark_bg_2 rounded-xl shadow p-3">
              <img src={req.sender.picture} alt={req.sender.name} className="w-10 h-10 rounded-full mr-3 border-2 border-green-400" />
              <span className="flex-1 font-medium text-lg text-white">{req.sender.name}</span>
              <button className="btn btn-success px-4 py-1 rounded-lg font-semibold" onClick={() => handleAccept(req._id)}>Accept</button>
            </li>
          ))}
          {/* Outgoing requests (pending) */}
          {outgoing.map(req => (
            <li key={req._id} className="flex items-center bg-dark_bg_2 rounded-xl shadow p-3 opacity-70">
              <img src={req.receiver.picture} alt={req.receiver.name} className="w-10 h-10 rounded-full mr-3 border-2 border-gray-400" />
              <span className="flex-1 font-medium text-lg text-white">{req.receiver.name}</span>
              <button className="btn btn-secondary px-4 py-1 rounded-lg font-semibold" disabled>Pending</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PendingRequests; 