document.addEventListener("DOMContentLoaded", async function() {
    let donations = [];
    try {
        const response = await fetch('/donations');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        donations = data.donations;
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu quyên góp:', error);
        return; // Dừng thực hiện nếu có lỗi
    }

    function getRandomElement(arr) {
        if (arr.length === 0) {
            return null;
        }
        const randomIndex = Math.floor(Math.random() * arr.length);
        return arr[randomIndex];
    }

    const donationMessage = document.getElementById('donation-message');
    const donationNotification = document.getElementById('donation-notification');

    if (!donationMessage || !donationNotification) {
        console.error('Không tìm thấy phần tử hiển thị thông báo quyên góp.');
        return;
    }

    function showRandomDonation() {
        const randomDonation = getRandomElement(donations);
        if (!randomDonation) {
            console.warn('Không có quyên góp nào để hiển thị.');
            return;
        }
        donationMessage.textContent = `${randomDonation.name} đã quyên góp $${randomDonation.amount}`;
        donationNotification.style.display = 'flex';
        donationNotification.classList.add('show');

        setTimeout(function() {
            donationNotification.classList.remove('show');
            setTimeout(function() {
                donationNotification.style.display = 'none';
                setTimeout(showRandomDonation, getRandomElement([10000, 15000, 20000])); // Thời gian ngẫu nhiên từ 10s đến 20s
            }, 500); // Chờ cho hiệu ứng trượt ra ngoài
        }, 5000); // 5 giây
    }

    setTimeout(showRandomDonation, getRandomElement([10000, 15000, 20000])); // Thời gian chờ ban đầu từ 1s đến 2s
});
