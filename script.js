function drawRoundedRect(ctx, x, y, width, height, radius) {
   ctx.beginPath();
   ctx.moveTo(x + radius, y);
   ctx.lineTo(x + width - radius, y);
   ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
   ctx.lineTo(x + width, y + height - radius);
   ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
   ctx.lineTo(x + radius, y + height);
   ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
   ctx.lineTo(x, y + radius);
   ctx.quadraticCurveTo(x, y, x + radius, y);
   ctx.closePath();
}

function updateCard() {
   const name = document.getElementById('name').value;
   const email = document.getElementById('email').value;
   const phone = document.getElementById('phone').value;
   const bgColor = document.getElementById('bgColor').value;
   const textColor = document.getElementById('textColor').value;
   const logoSizePercentageX = document.getElementById('logoSizeX').value;
   const logoSizePercentageY = document.getElementById('logoSizeY').value;

   // Update displayed card
   document.getElementById('businessCard').style.backgroundColor = bgColor;
   document.getElementById('displayName').innerText = name;
   document.getElementById('displayName').style.color = textColor;
   document.getElementById('displayEmail').innerText = email;
   document.getElementById('displayEmail').style.color = textColor;
   document.getElementById('displayPhone').innerText = phone;
   document.getElementById('displayPhone').style.color = textColor;

   // Create a URL with contact details for the landing page
   const contactUrl = `contact.html?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`;

   // Update QR code
   QRCode.toCanvas(document.getElementById('qrcode'), contactUrl, { errorCorrectionLevel: 'H' }, function (error, qrCanvas) {
       if (error) console.error(error);

       const logoFile = document.getElementById('logo').files[0];
       if (logoFile) {
           const reader = new FileReader();
           reader.onload = function (e) {
               const qrContext = qrCanvas.getContext('2d');
               const logo = new Image();
               logo.onload = function () {
                   const logoSizeX = qrCanvas.width * (logoSizePercentageX / 100);
                   const logoSizeY = qrCanvas.height * (logoSizePercentageY / 100);
                   const logoMargin = 13;
                   const logoX = (qrCanvas.width - logoSizeX) / 2;
                   const logoY = (qrCanvas.height - logoSizeY) / 2;
                   qrContext.fillStyle = "#ffffff"; // Set background color behind the logo to white
                   qrContext.fillRect(logoX - logoMargin, logoY - logoMargin, logoSizeX + logoMargin * 2, logoSizeY + logoMargin * 2);
                   qrContext.drawImage(logo, logoX, logoY, logoSizeX, logoSizeY);

                   // Update combined canvas
                   updateCombinedCanvas(name, email, phone, bgColor, textColor, qrCanvas);
               };
               logo.src = e.target.result;
           };
           reader.readAsDataURL(logoFile);
       } else {
           // Update combined canvas
           updateCombinedCanvas(name, email, phone, bgColor, textColor, qrCanvas);
       }
   });
}

function updateCombinedCanvas(name, email, phone, bgColor, textColor, qrCanvas) {
   const combinedCanvas = document.getElementById('combinedCanvas');
   const cardWidth = 300;
   const cardHeight = 500;
   combinedCanvas.width = cardWidth;
   combinedCanvas.height = cardHeight;
   const ctx = combinedCanvas.getContext('2d');

   // Draw background with rounded rectangle
   const cardX = 0;
   const cardY = 0;
   const cardRadius = 10;

   ctx.fillStyle = bgColor;
   drawRoundedRect(ctx, cardX, cardY, cardWidth, cardHeight, cardRadius);
   ctx.fill();

   ctx.strokeStyle = "#ccc";
   ctx.lineWidth = 1;
   drawRoundedRect(ctx, cardX, cardY, cardWidth, cardHeight, cardRadius);
   ctx.stroke();

   // Draw text
   ctx.fillStyle = textColor;
   ctx.font = "bold 20px Arial";
   ctx.textAlign = "center";
   ctx.fillText(name, combinedCanvas.width / 2, 50);

   ctx.font = "16px Arial";
   ctx.fillText(email, combinedCanvas.width / 2, 100);
   ctx.fillText(phone, combinedCanvas.width / 2, 150);

   // Draw QR code
   ctx.drawImage(qrCanvas, (combinedCanvas.width - qrCanvas.width) / 2, 200);

   // Create a data URL from the combined canvas
   const dataUrl = combinedCanvas.toDataURL('image/png');

   // Create a download link for the combined canvas
   const downloadLink = document.getElementById('downloadLink');
   downloadLink.href = dataUrl;
   downloadLink.download = 'business_card.png';
   downloadLink.style.display = 'block';
   downloadLink.innerText = 'Download Business Card';

   // Generate the wallet pass
   generateWalletPass(name, email, phone, qrCanvas.toDataURL('image/png'));
}

function generateWalletPass(name, email, phone, qrDataUrl) {
   const passData = {
       "formatVersion": 1,
       "passTypeIdentifier": "pass.com.example.pass",
       "serialNumber": "1234567890",
       "teamIdentifier": "ABCDEFGHIJ",
       "organizationName": "Example",
       "description": "Business Card",
       "logoText": name,
       "foregroundColor": "#FFFFFF",
       "backgroundColor": "#000000",
       "barcode": {
           "message": `${name}\n${email}\n${phone}`,
           "format": "PKBarcodeFormatQR",
           "messageEncoding": "iso-8859-1"
       },
       "storeCard": {
           "primaryFields": [
               {
                   "key": "name",
                   "label": "Name",
                   "value": name
               },
               {
                   "key": "email",
                   "label": "Email",
                   "value": email
               },
               {
                   "key": "phone",
                   "label": "Phone",
                   "value": phone
               }
           ]
       },
       "images": {
           "icon": qrDataUrl,
           "logo": qrDataUrl
       }
   };

   const passBlob = new Blob([JSON.stringify(passData)], { type: 'application/vnd.apple.pkpass' });
   const passUrl = URL.createObjectURL(passBlob);

   const walletLink = document.getElementById('walletLink');
   walletLink.href = passUrl;
   walletLink.download = 'business_card.pkpass';
   walletLink.style.display = 'block';
   walletLink.innerText = 'Download Wallet Pass';
}

document.getElementById('generateButton').addEventListener('click', updateCard);

document.getElementById('name').addEventListener('input', updateCard);
document.getElementById('email').addEventListener('input', updateCard);
document.getElementById('phone').addEventListener('input', updateCard);
document.getElementById('bgColor').addEventListener('input', updateCard);
document.getElementById('textColor').addEventListener('input', updateCard);
document.getElementById('logo').addEventListener('change', updateCard);
document.getElementById('logoSizeX').addEventListener('input', updateCard);
document.getElementById('logoSizeY').addEventListener('input', updateCard);

// Initial update to ensure everything is set up correctly
updateCard();
