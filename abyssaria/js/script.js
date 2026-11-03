"use strict";

/*LOYALTY CALCULATOR*/

const form = document.getElementById("loyaltyForm");

if (form) {

    const nameInput = document.getElementById("customerName");
    const emailInput = document.getElementById("customerEmail");
    const amountInput = document.getElementById("purchaseAmount");

    const membershipGroup = document.getElementById("membershipGroup");
    const membershipError = document.getElementById("membershipError");

    const packageButtons = document.querySelectorAll(".package-option");
    const resultCard = document.getElementById("resultCard");

    const memberships = {
        seashell: { name: "Seashell Explorer", rate: 0},
        coral: { name: "Coral Voyager", rate: 5},
         pearl: { name: "Pearl Guardian", rate: 10 },
        trident: { name: "Trident Elite", rate: 15 }
    };

    let selectedAdventure = null;

    function formatMoney(cents) {
        return "RM" + (cents / 100).toFixed(2);
    }

    //display field error

    function showError(input, errorId, message){
        input.setAttribute("aria-invalid", "true");
        document.getElementById(errorId).textContent = message;
    }

    // Clear field error
    function clearError(input, errorId) {
        input.removeAttribute("aria-invalid");
        document.getElementById(errorId).textContent = "";
    }

    function clearMembershipError() {
        membershipError.textContent = "";
        membershipGroup.classList.remove("is-invalid");
    }

    function clearResult() {
        resultCard.hidden = true;

        const outputIds = [
            "resultName",
            "resultEmail",
            "resultAdventure",
            "resultMembership",
            "resultOriginal",
            "resultRate",
            "resultDiscount",
            "resultFinal"
        ];

        outputIds.forEach(function(id) {
            document.getElementById(id).textContent = "";
        });
        document.getElementById("adventureRow").hidden = true;
    }

    // Update package selection appearance
    function updatePackages() {
        packageButtons.forEach(function(button) {
            const isSelected =
                selectedAdventure === button.dataset.name;

            button.classList.toggle("is-selected", isSelected);
            button.setAttribute("aria-pressed", String(isSelected));
        });
    }

     // Package quick-fill
    packageButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const clickedAdventure = button.dataset.name;

        // Click the same package again to deselect it
        if (selectedAdventure === clickedAdventure) {

            selectedAdventure = null;
            amountInput.value = "";

        } else {

            // Select a new adventure package
            selectedAdventure = clickedAdventure;
            amountInput.value = button.dataset.price;

        }

        // Update selection appearance
        updatePackages();

        // Clear previous errors and results
        clearError(amountInput, "amountError");
        clearResult();

    });

});

    // Clear errors and outdated result when editing
    nameInput.addEventListener("input", function() {
        clearError(nameInput, "nameError");
        clearResult();
    });

    emailInput.addEventListener("input", function() {
        clearError(emailInput, "emailError");
        clearResult();
    });

    amountInput.addEventListener("input", function() {
        selectedAdventure = null;
        updatePackages();

        clearError(amountInput, "amountError");
        clearResult();
    });

    form.addEventListener("change", function(event) {
        if (event.target.name === "membership") {
            clearMembershipError();
            clearResult();
        }
    });

    // Validate and calculate
    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const customerName = nameInput.value.trim();
        const customerEmail = emailInput.value.trim();
        const amountText = amountInput.value.trim();

        const selectedMembership = form.querySelector(
            'input[name="membership"]:checked'
        );

        let firstInvalid = null;

        // Name validation
        if (customerName.length < 2 ||
            customerName.length > 60) {

            showError(
                nameInput,
                "nameError",
                "Name must contain 2 to 60 characters."
            );

            firstInvalid = nameInput;
        } else {
            clearError(nameInput, "nameError");
        }

        // Email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(customerEmail)) {
            showError(
                emailInput,
                "emailError",
                "Please enter a valid email address."
            );

            if (!firstInvalid) firstInvalid = emailInput;
        } else {
            clearError(emailInput, "emailError");
        }

        // Purchase amount validation
        const amountPattern = /^\d+(\.\d{1,2})?$/;
        const amount = Number(amountText);

        if (
            amountText === "" ||
            !amountPattern.test(amountText) ||
            !Number.isFinite(amount) ||
            amount <= 0 ||
            amount > 5000
        ) {
            showError(
                amountInput,
                "amountError",
                "Enter an amount above RM0 and up to RM5,000 with at most 2 decimal places."
            );

            if (!firstInvalid) firstInvalid = amountInput;
        } else {
            clearError(amountInput, "amountError");
        }

        // Membership validation
        if (
            !selectedMembership ||
            !Object.prototype.hasOwnProperty.call(
                memberships,
                selectedMembership.value
            )
        ) {
            membershipError.textContent =
                "Please select a valid membership level.";

            membershipGroup.classList.add("is-invalid");

            if (!firstInvalid) {
                firstInvalid = form.querySelector(
                    'input[name="membership"]'
                );
            }
        } else {
            clearMembershipError();
        }

        // Block calculation if invalid
        if (firstInvalid) {
            clearResult();
            firstInvalid.focus();
            return;
        }

        // Calculate using integer sen
        const membership = memberships[selectedMembership.value];

        const originalCents = Math.round(amount * 100);
        const discountCents = Math.round(
            originalCents * membership.rate / 100
        );
        const finalCents = originalCents - discountCents;

        // Display receipt
        document.getElementById("resultName").textContent =
            customerName;

        document.getElementById("resultEmail").textContent =
            customerEmail;

        document.getElementById("resultMembership").textContent =
            membership.name;

        document.getElementById("resultOriginal").textContent =
            formatMoney(originalCents);

        document.getElementById("resultRate").textContent =
            membership.rate + "%";

        document.getElementById("resultDiscount").textContent =
            formatMoney(discountCents);

        document.getElementById("resultFinal").textContent =
            formatMoney(finalCents);

        // Show adventure only if selected
        if (selectedAdventure) {
            document.getElementById("resultAdventure").textContent =
                selectedAdventure;

            document.getElementById("adventureRow").hidden = false;
        }

        resultCard.hidden = false;


        resultCard.scrollIntoView({ block: "start" });
    });

    // Reset form
    form.addEventListener("reset", function() {
        selectedAdventure = null;
        updatePackages();

        clearError(nameInput, "nameError");
        clearError(emailInput, "emailError");
        clearError(amountInput, "amountError");
        clearMembershipError();
        clearResult();
    });
}








// ABYSSARIA - Interactive Kiosk
// JavaScript validation and calculator logic
// will be added in upcoming development stages.
