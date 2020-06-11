const API_URL = 'https://typefastgame.herokuapp.com';

const sentenceDiv = document.getElementById("sentence");
const addButton = document.getElementById("addButton");
const deleteButton = document.getElementById("deleteButton");

addButton.addEventListener("click", addLast);
deleteButton.addEventListener("click", deleteLast);

let validationData;
getValidationData();

function deleteLast() {
	const callDelete = async () => {
		try {
			const response = await fetch(`${API_URL}/sentences/validationList/delete`, {
				method: "DELETE",
				headers: {
					"Content-type": "application/json",
				},
			});
			console.log(response);
			if (response.ok) {
				console.log("delete call response status:", response.status);
			}
		} catch (error) {
			console.log(error);
		}
	};

	callDelete();
	getValidationData();
}

function addLast() {
	const callPut = async () => {
		try {
			const response = await fetch(`${API_URL}/sentences/validationList/add`, {
				method: "PUT",
				headers: {
					"Content-type": "application/json",
				},
			});
			console.log(response);
			if (response.ok) {
				console.log("put call response status:", response.status);
			}
		} catch (error) {
			console.log(error);
		}
	};

	callPut();
	getValidationData();
}

function getValidationData() {
	const callGet = async () => {
		try {
			const response = await fetch(`${API_URL}/sentences/validationList`, {
				method: "GET",
				headers: {
					"Content-type": "application/json",
				},
			});
			console.log(response);
			if (response.ok) {
				validationData = await response.json();
				console.log("array in sentences response.ok", validationData.array);
				if (validationData.array.length > 0) {
					sentenceDiv.innerText =
						validationData.array[validationData.array.length - 1].sentence;
				} else {
					turnOffButtonsAndSayGodBye();
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	callGet();
}

function turnOffButtonsAndSayGodBye() {
    addButton.disabled = true;
    deleteButton.disabled = true;
    sentenceDiv.innerText = "That was it! Goodbye."
}