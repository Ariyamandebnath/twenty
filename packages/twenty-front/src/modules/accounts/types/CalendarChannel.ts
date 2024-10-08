import { CalendarChannelVisibility } from '~/generated/graphql';

export type CalendarChannel = {
  id: string;
  handle: string;
  isContactAutoCreationEnabled?: boolean;
  isSyncEnabled?: boolean;
  visibility: CalendarChannelVisibility;
  syncStatus: string;
  __typename: 'CalendarChannel';
};
