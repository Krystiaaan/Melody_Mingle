import { IUser } from "./User.interface";

export type IGroup = {
  id: string;
  name: string;
  creator: string;
};

export interface IShowGroupsProps {
  user: IUser;
  accessToken: string | null;
  ownGroups: IGroup[];
}

export type GroupMember = {
  groupId: string;
  userId: string;
};

export type GroupInfo = {
  Group: IGroup;
  User: IUser;
  GroupMember: GroupMember;
};
