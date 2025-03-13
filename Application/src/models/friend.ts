export interface FriendProps {
  avatar: string;
  pseudo: string;
  isRequest : boolean;
  acceptRequest : Function;
  requestId?:string;
}

export interface FriendAndRequestProps {
  myFriends: Array<FriendProps>;
  requests: Array<FriendProps>;
}
