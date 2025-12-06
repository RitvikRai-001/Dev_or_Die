import { useState, useEffect } from "react";

export default function SignupForm() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        gender: "",
        age: "",
        role: "",
        password: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    });

    function updateField(field, value) {
        setForm({ ...form, [field]: value });
    }

    
    function isValidEmail(email) {
    if (!email) return false;

    if (email.includes(" ")) return false;

    const atIndex = email.indexOf("@");
    if (atIndex <= 0) return false; 

    const dotIndex = email.lastIndexOf(".");
    if (dotIndex <= atIndex + 1) return false;

    if (dotIndex === email.length - 1) return false;

    return true;
}


    
    function isValidPassword(pass) {
    if (!pass) return false;

    if (pass.length < 3 || pass.length > 20) return false;

    let hasUpper = false;
    let hasLower = false;
    let hasDigit = false;
    let hasSpecial = false;

    const specialChars = "@$!%*?&";

    for (let char of pass) {
        if (char >= "A" && char <= "Z") hasUpper = true;
        else if (char >= "a" && char <= "z") hasLower = true;
        else if (char >= "0" && char <= "9") hasDigit = true;
        else if (specialChars.includes(char)) hasSpecial = true;
    }

    return hasUpper && hasLower && hasDigit && hasSpecial;
}


    
    useEffect(() => {
        let newErrors = { ...errors };

        
        if (form.email.length > 0 && !isValidEmail(form.email)) {
            newErrors.email = "Enter a valid email address.";
        } else {
            newErrors.email = "";
        }

       
        if (form.password.length > 0 && !isValidPassword(form.password)) {
            newErrors.password =
                "Password must be 3–20 characters long with uppercase, lowercase, digit & special character.";
        } else {
            newErrors.password = "";
        }

        
        if (form.confirmPassword.length > 0 && form.password !== form.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
        } else {
            newErrors.confirmPassword = "";
        }

        setErrors(newErrors);
    }, [form.email, form.password, form.confirmPassword]);

    function handleSubmit(e) {
        e.preventDefault();

        if (errors.email || errors.password || errors.confirmPassword) {
            return;
        }

        alert("Form submitted successfully!");
    }

    return (
        <form className="form" onSubmit={handleSubmit}>

            <input
                type="text"
                placeholder="Username"
                value={form.username}
                onChange={(e) => updateField("username", e.target.value)}
                required
            />

            <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                required
            />
            {errors.email && <p className="error-text">{errors.email}</p>}

            <input
                type="number"
                placeholder="Age"
                min="0"
                value={form.age}
                onChange={(e) => updateField("age", e.target.value)}
                required
            />

            <select
                value={form.gender}
                onChange={(e) => updateField("gender", e.target.value)}
                required
            >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
            </select>

            <select
                value={form.role}
                onChange={(e) => updateField("role", e.target.value)}
                required
            >
                <option value="">Select Role</option>
                <option value="ranger">Ranger</option>
                <option value="doctor">Doctor</option>
            </select>

            <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
                required
            />
            {errors.password && <p className="error-text">{errors.password}</p>}

            <input
                type="password"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={(e) => updateField("confirmPassword", e.target.value)}
                required
            />
            {errors.confirmPassword && (
                <p className="error-text">{errors.confirmPassword}</p>
            )}

            <button type="submit" className="form-btn">
                Sign Up
            </button>
        </form>
    );
}
