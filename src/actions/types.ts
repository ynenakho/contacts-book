export type ContactType = {
  id?: number | null;
  firstName: string;
  lastName: string;
  emails: string[];
};

export type ContactsResponseData = {
  page: number;
  itemsPerPage: number;
  totalItems: number;
  contacts: ContactType[];
};
