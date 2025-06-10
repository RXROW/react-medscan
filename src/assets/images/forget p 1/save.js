// دالة للانتقال إلى صفحة أخرى (للتبويب)
function goToPage(url) {
    window.location.href = url;
}

// التحقق من البريد الإلكتروني عند الضغط على "Submit"
document.querySelector(".submit-btn").addEventListener("click", function(event) {
    event.preventDefault(); // منع إرسال النموذج الافتراضي

    const emailInput = document.getElementById("email");
    const emailValue = emailInput.value.trim();

    // التحقق من أن الحقل ليس فارغًا
    if (!emailValue) {
        alert("Please enter your email.");
        return;
    }

    // التحقق من تنسيق البريد الإلكتروني باستخدام تعبير منتظم
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailValue)) {
        alert("Please enter a valid email address.");
        return;
    }

    // إذا نجح التحقق، يتم إعادة التوجيه إلى صفحة التحقق (مثال)
    alert("Password recovery email sent! Redirecting to verification...");
    // استبدل الرابط بالصفحة التي تريد التوجيه إليها
    window.location.href = "file:/C:/Users/abanob/OneDrive/Desktop/updated%20grag/English/forget/patient/forget%20p%202/index.html";
});

// التفاعل مع أزرار تسجيل الدخول الاجتماعي
document.querySelectorAll(".social-btn").forEach(button => {
    button.addEventListener("click", function() {
        const platform = this.classList[1]; // الحصول على المنصة (facebook, google, apple)
        alert(`Login with ${platform.charAt(0).toUpperCase() + platform.slice(1)} is not implemented yet.`);
        // يمكن استبدال التنبيه بمنطق تسجيل الدخول الفعلي (مثل استدعاء API)
    });
});

// إضافة تفاعل مع رابط "Back to login"
document.querySelector(".back-link").addEventListener("click", function(event) {
    event.preventDefault();
    // استبدل الرابط بالصفحة التي تريد العودة إليها
    window.location.href = "file:/C:/Users/abanob/OneDrive/Desktop/updated%20grag/English/login%20in%20&%20up/Log%20In%20as%20patient/index.html";
});