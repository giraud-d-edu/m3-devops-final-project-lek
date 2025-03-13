export interface ProfileProps {
  avatar: string;
  email: string;
  pseudo: string;
}

export interface AvatarModalProps {
  currentAvatar: string;
  callback: Function;
}