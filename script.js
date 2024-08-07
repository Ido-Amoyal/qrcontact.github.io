let flag = false;

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
    const org = document.getElementById('org').value;
    const role = document.getElementById('role').value;
    const linkedIn_link = document.getElementById('linkedIn_link').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const event = document.getElementById('event').value;
    const bgColor = document.getElementById('bgColor').value;
    const textColor = document.getElementById('textColor').value;
    const logoSizePercentageX = document.getElementById('logoSizeX').value;
    const logoSizePercentageY = document.getElementById('logoSizeY').value;

    // Update displayed card
    document.getElementById('businessCard').style.backgroundColor = bgColor;
    document.getElementById('displayName').innerText = name;
    document.getElementById('displayName').style.color = textColor;
    document.getElementById('displayRole').innerText = role;
    document.getElementById('displayRole').style.color = textColor;
    document.getElementById('displayOrg').innerText = org;
    document.getElementById('displayOrg').style.color = textColor;

    // Update QR code
    const vCardData = `BEGIN:VCARD
VERSION:3.0
N:;${name}
NAME:${name}
ORG:${org}
TITLE:${role}
TEL;TYPE=CELL:${phone}
EMAIL:${email}
URL;TYPE=linkedin:https://${linkedIn_link}
NOTE:Event: ${event}
END:VCARD`;

    const logoFile = document.getElementById('logo').files[0];
    if (logoFile) {
        const cardWidth = 400;
        const cardHeight = 670;

        const reader = new FileReader();
        reader.onload = function (e) {
            QRCode.toCanvas(document.getElementById('qrcode'), vCardData, { errorCorrectionLevel: 'H' }, function (error, qrCanvas) {
                if (error) console.error(error);

                const qrContext = qrCanvas.getContext('2d');
                const logo = new Image();
                logo.onload = function () {
                    const logoSizeX = qrCanvas.width * (logoSizePercentageX / 100);
                    const logoSizeY = qrCanvas.height * (logoSizePercentageY / 100);
                    console.log(logoSizeX);

                    console.log(logoSizeY);

                    const logoMargin = 13;
                    const logoX = (qrCanvas.width - logoSizeX) / 2;
                    const logoY = (qrCanvas.height - logoSizeY) / 2;
                    qrContext.fillStyle = "#ffffff"; // Set background color behind the logo to white
                    qrContext.fillRect(logoX - logoMargin, logoY - logoMargin, logoSizeX + logoMargin * 2, logoSizeY + logoMargin * 2);
                    qrContext.drawImage(logo, logoX, logoY, logoSizeX, logoSizeY);

                    // Update combined canvas
                    updateCombinedCanvas(name, org, role, bgColor, textColor, qrCanvas,cardWidth,cardHeight);
                };
                logo.src = e.target.result;
            });
        };
        reader.readAsDataURL(logoFile);
    } else {
        const cardWidth = 350;
        const cardHeight = 610;
        QRCode.toCanvas(document.getElementById('qrcode'), vCardData, function (error, qrCanvas) {
            if (error) console.error(error);

            // Update combined canvas
            updateCombinedCanvas(name, org, role, bgColor, textColor, qrCanvas,cardWidth,cardHeight);
        });
    }
}

function updateCombinedCanvas(name, org, role, bgColor, textColor, qrCanvas,cardWidth,cardHeight) {
    const combinedCanvas = document.getElementById('combinedCanvas');
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
    ctx.font = "bold 30px Arial";
    ctx.textAlign = "center";
    ctx.fillText(org.toUpperCase(), combinedCanvas.width / 2, 100); // Align with displayed card
    if(350 == cardHeight){
        ctx.fillText(name.toUpperCase(), combinedCanvas.width / 2, 490); // Rearrange order
        ctx.fillText(role.toUpperCase(), combinedCanvas.width / 2, 540); // Rearrange order
    }
    else{
        ctx.fillText(name.toUpperCase(), combinedCanvas.width / 2, 550); // Rearrange order
        ctx.fillText(role.toUpperCase(), combinedCanvas.width / 2, 600); // Rearrange order
    }

    // Draw QR code
    ctx.drawImage(qrCanvas, (combinedCanvas.width - qrCanvas.width) / 2, 150); // Adjust QR code position

    // Create a data URL from the combined canvas
    const dataUrl = combinedCanvas.toDataURL('image/png');

    // Create a download link for the combined canvas
    const downloadLink = document.getElementById('downloadLink');
    downloadLink.href = dataUrl;
    downloadLink.download = 'business_card.png';
    downloadLink.style.display = 'block';
    downloadLink.innerText = 'Download Business Card';
}

document.getElementById('org').addEventListener('input', updateCard);
document.getElementById('name').addEventListener('input', updateCard);
document.getElementById('role').addEventListener('input', updateCard);
document.getElementById('linkedIn_link').addEventListener('input', updateCard);
document.getElementById('email').addEventListener('input', updateCard);
document.getElementById('phone').addEventListener('input', updateCard);
document.getElementById('bgColor').addEventListener('input', updateCard);
document.getElementById('textColor').addEventListener('input', updateCard);
document.getElementById('logo').addEventListener('change', updateCard);
document.getElementById('logoSizeX').addEventListener('input', updateCard);
document.getElementById('logoSizeY').addEventListener('input', updateCard);
document.getElementById('event').addEventListener('input', updateCard);

// Initial update to ensure everything is set up correctly
updateCard();
