import { Ref, ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
export const messagesList: Ref<any[]> = ref([]);

interface flashMessage {
	text: string;
	type: 'warning' | 'error' | 'success';
	closable?: boolean;
	command?: {
		label: string;
		function: () => void;
	};
}

export const sendFlashMessage = (data: flashMessage) => {
	messagesList.value.push({ id: uuidv4(), ...data });
};
