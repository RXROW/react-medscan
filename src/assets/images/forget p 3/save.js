// دالة لإظهار/إخفاء كلمة المرور عند النقر على أيقونة العين
function togglePassword(fieldId) {
    const passwordField = document.getElementById(fieldId);
    const eyeIcon = passwordField.nextElementSibling.querySelector("img");

    if (passwordField.type === "password") {
        passwordField.type = "text";
        eyeIcon.src = "eye.png"; // استبدل بمسار أيقونة العين المفتوحة
        eyeIcon.alt = "Hide Password";
    } else {
        passwordField.type = "password";
        eyeIcon.src = "eye_with_black_diagonal_line.png"; // استبدل بمسار أيقونة العين المغلقة
        eyeIcon.alt = "Show Password";
    }
}

// التحقق من تطابق كلمتي المرور وشروط الأرقام عند الضغط على زر "Set password"
document.getElementById("passwordForm").addEventListener("submit", function(event) {
    event.preventDefault(); // منع إرسال النموذج الافتراضي

    const createPassword = document.getElementById("create-password").value;
    const reenterPassword = document.getElementById("reenter-password").value;

    // التحقق من وجود 6 أرقام على الأقل في كلمة المرور
    const digitCount = (createPassword.match(/\d/g) || []).length;

    if (digitCount < 6) {
        alert("Password must contain at least 6 digits.");
        return;
    }

    if (createPassword === reenterPassword) {
        alert("Password set successfully!"); // رسالة نجاح
        // إعادة توجيه المستخدم إلى صفحة أخرى (مثال)
        // يمكنك استبدال الرابط بالصفحة التي تريدها
        window.location.href = "file:///C:/Users/abanob/OneDrive/Desktop/updated%20grag/English/login%20in%20&%20up/Log%20In%20as%20patient/index.html";
    } else {
        alert("Passwords do not match. Please try again."); // رسالة خطأ
    }
});

// دالة للانتقال إلى صفحة أخرى (للتبويب)
function goToPage(url) {
    window.location.href = url;
}
