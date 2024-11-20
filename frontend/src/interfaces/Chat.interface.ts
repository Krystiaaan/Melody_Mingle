import { IGroup } from "./Group.interface";
import { IUser } from "./User.interface";

export interface ChatWindowProps {
  loggedInUser: IUser;
  selectedUser: IUser;
  selectedGroupForChat: IGroup;
  onClose: () => void;
}

export type Message = {
  User: IUser;
  Message: {
    text: string;
  };
};
