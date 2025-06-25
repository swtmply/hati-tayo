import * as Contacts from "expo-contacts";
import React from "react";

export default function useContacts() {
	const [contacts, setContacts] = React.useState<Contacts.Contact[]>([]);
	const [status, setStatus] = React.useState<Contacts.PermissionStatus>(
		Contacts.PermissionStatus.UNDETERMINED,
	);

	React.useEffect(() => {
		(async () => {
			const { status } = await Contacts.requestPermissionsAsync();
			setStatus(status);
			if (status === Contacts.PermissionStatus.GRANTED) {
				const { data } = await Contacts.getContactsAsync({
					fields: [
						Contacts.Fields.Emails,
						Contacts.Fields.PhoneNumbers,
						Contacts.Fields.Name,
					],
				});

				setContacts(data);
			}
		})();
	}, []);

	return { contacts, status };
}
