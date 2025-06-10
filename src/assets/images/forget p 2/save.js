// دالة للانتقال إلى صفحة أخرى (للتبويب)
function goToPage(url) {
    window.location.href = url;
}

// دالة لتحديث الوقت
function startTimer() {
    let time = 60; // الوقت بالثواني (60 ثانية = 00:60)
    const timeElement = document.querySelector(".time");

    const timer = setInterval(() => {
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        timeElement.textContent = `00:${seconds < 10 ? "0" + seconds : seconds} Sec`;

        if (time <= 0) {
            clearInterval(timer);
            timeElement.textContent = "00:00 Sec";
            // يمكن إضافة منطق هنا لإعادة إرسال تلقائي إذا أردت
        } else {
            time--;
        }
    }, 1000); // تحديث كل ثانية

    // إعادة تعيين الوقت عند النقر على "Resend"
    document.querySelector(".resend-link").addEventListener("click", function(event) {
        event.preventDefault();
        time = 60;
        clearInterval(timer); // إيقاف المؤقت الحالي
        startTimer(); // بدء المؤقت من جديد
        // يمكن إضافة منطق هنا لإرسال الكود مرة أخرى (مثل استدعاء API)
        alert("Code has been resent!");
    });
}

// دالة للتحقق من الكود عند الضغط على "Verify"
document.querySelector(".verify-btn").addEventListener("click", function() {
    const codeInputs = document.querySelectorAll(".code-inputs input");
    let code = "";
    let isValid = true;

    // جمع القيم من الحقول
    codeInputs.forEach(input => {
        code += input.value;
        if (!input.value) {
            isValid = false; // تحقق من أن جميع الحقول مليئة
        }
    });

    if (!isValid) {
        alert("Please fill all code fields.");
        return;
    }

    // هنا يمكن إضافة منطق للتحقق من صحة الكود (مثل مقارنته بقيمة من قاعدة بيانات)
    const correctCode = "2553";
    if (code === correctCode) {
        alert("Code verified successfully!");
        // إعادة توجيه إلى صفحة أخرى (استبدل الرابط حسب الحاجة)
        window.location.href = "file:/C:/Users/abanob/OneDrive/Desktop/updated%20grag/English/forget/patient/forget%20p%203/index.html";
    } else {
        alert("Invalid code. Please try again.");
    }
});

// بدء المؤقت عند تحميل الصفحة
window.onload = startTimer;