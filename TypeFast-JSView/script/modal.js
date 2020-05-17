// Get the modal
const modal = document.getElementById("myModal");

// Get the button that opens the modal
const btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function () {
	modal.style.display = "block";
    // this timeout is a workaround to help create the fade in effect
    // because transition-duration does not affect the "display" css property
	setTimeout(() => {
		modal.style.opacity = "1";
	}, 100);
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
	modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
	if (event.target == modal) {
		modal.style.opacity = "0";
		this.setTimeout(() => {
			modal.style.display = "none";
		}, 1000);
	}
};
