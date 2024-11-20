export interface IEvent {
  id: string;
  creator: string;
  eventName: string;
  eventType: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  isPrivate: boolean;
}

export interface EventProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenModal: () => void;
}
