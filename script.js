document.addEventListener("DOMContentLoaded", function () {
    const { jsPDF } = window.jspdf; 
    const addRowBtn = document.getElementById("add-row");
    const invoiceBody = document.getElementById("invoice-body");
    const savePdfBtn = document.getElementById("save-pdf");

    
    function updateTotals() {
        let subtotal = 0;
        document.querySelectorAll("#invoice-body tr").forEach(row => {
            let qty = parseFloat(row.querySelector(".qty").value) || 0;
            let price = parseFloat(row.querySelector(".price").value) || 0;
            let total = qty * price;
            row.querySelector(".total").textContent = total.toFixed(2);
            subtotal += total;
        });

        let tax = subtotal * 0.1; 
        let grandTotal = subtotal + tax;

        document.getElementById("subtotal").textContent = subtotal.toFixed(2);
        document.getElementById("tax").textContent = tax.toFixed(2);
        document.getElementById("grand-total").textContent = grandTotal.toFixed(2);
    }

    
    addRowBtn.addEventListener("click", function () {
        let newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td><input type="text" placeholder="Part Name" required></td>
            <td><input type="number" class="qty" value="1" min="1"></td>
            <td><input type="number" class="price" value="0" min="0"></td>
            <td class="total">0.00</td>
            <td><button class="remove-row">❌</button></td>
        `;
        invoiceBody.appendChild(newRow);
        updateTotals();
    });

   
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("remove-row")) {
            event.target.closest("tr").remove();
            updateTotals();
        }
    });

   
    document.addEventListener("input", function (event) {
        if (event.target.classList.contains("qty") || event.target.classList.contains("price")) {
            updateTotals();
        }
    });


    savePdfBtn.addEventListener("click", function () {
        let doc = new jsPDF();
        doc.setFont("helvetica", "bold");
        doc.text("PC Parts Quotation & Invoice", 10, 10);
        
        let rows = [];
        document.querySelectorAll("#invoice-body tr").forEach(row => {
            let item = row.querySelector("td input[type='text']").value || "N/A";
            let qty = row.querySelector(".qty").value;
            let price = row.querySelector(".price").value;
            let total = row.querySelector(".total").textContent;
            rows.push([item, qty, `$${price}`, `$${total}`]);
        });

       
        doc.autoTable({
            startY: 20,
            head: [["Item", "Quantity", "Unit Price", "Total"]],
            body: rows
        });

        let finalY = doc.lastAutoTable.finalY + 10;
        doc.text(`Subtotal: $${document.getElementById("subtotal").textContent}`, 10, finalY);
        doc.text(`Tax (10%): $${document.getElementById("tax").textContent}`, 10, finalY + 10);
        doc.text(`Grand Total: $${document.getElementById("grand-total").textContent}`, 10, finalY + 20);

        doc.save("PC_Invoice.pdf");
    });

    updateTotals(); 
});