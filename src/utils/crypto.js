import { pbkdf2Sync } from "pbkdf2";
import { Buffer } from "safe-buffer";
import hkdf from "futoin-hkdf";

// DeriveMasterKey: derive a master key from user password using PBKDF2. Use WebCrypto API if available.
async function DeriveMasterKey(password, salt, len) {
    const enc = new TextEncoder();
    if (window.isSecureContext) {
        const keyMaterial = await crypto.subtle.importKey(
            "raw",
            enc.encode(password),
            { name: "PBKDF2" },
            false,
            ["deriveBits"]
        );
        const derivedBits = await crypto.subtle.deriveBits(
            {
                name: "PBKDF2",
                salt: enc.encode(salt),
                iterations: 1000,
                hash: "SHA-512",
            },
            keyMaterial,
            len
        );
        return Buffer.from(derivedBits);
    } else {
        return pbkdf2Sync(password, salt, 1000, len >> 3, "sha512");
    }
}

// DeriveAuthKey: Derive Auth key for authentication from the master key. Use WebCrypto API if available
async function DeriveAuthKey(masterKey, len) {
    if (window.isSecureContext) {
        const keyMaterial = await crypto.subtle.importKey(
            "raw",
            masterKey,
            { name: "HKDF" },
            false,
            ["deriveBits"]
        );
        const derivedBits = await crypto.subtle.deriveBits(
            {
                name: "HKDF",
                salt: Buffer.from(""),
                info: Buffer.from("HOME-CLOUD-AUTH-KEY-FOR-LOGIN"),
                hash: "SHA-512",
            },
            keyMaterial,
            len
        );
        return Buffer.from(derivedBits).toString("hex");
    }
    return hkdf(masterKey, len >> 3, {
        hash: "SHA-512",
        info: "HOME-CLOUD-AUTH-KEY-FOR-LOGIN",
    }).toString("hex");
}

// DeriveAuthKey: Derive Auth key for authentication from the master key. Use WebCrypto API if available
async function DeriveEncryptionKey(masterKey, len) {
    if (window.isSecureContext) {
        const keyMaterial = await crypto.subtle.importKey(
            "raw",
            masterKey,
            { name: "HKDF" },
            false,
            ["deriveBits"]
        );
        const derivedBits = await crypto.subtle.deriveBits(
            {
                name: "HKDF",
                salt: Buffer.from(""),
                info: Buffer.from("HOME-CLOUD-ENCRYPTION-KEY-FOR-FILES"),
                hash: "SHA-512",
            },
            keyMaterial,
            len
        );
        return Buffer.from(derivedBits).toString("hex");
    }
    return hkdf(masterKey, len >> 3, {
        hash: "SHA-512",
        info: "HOME-CLOUD-ENCRYPTION-KEY-FOR-FILES",
    }).toString("hex");
}



// GenerateSalt: Generate a random salt for sign up
async function GenerateSalt(len) {
    len = len / 4;
    const n = new Uint8Array(len);
    const chars =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890~!@#$%^&*()_+=-/";
    let salt = [];
    crypto.getRandomValues(n).forEach((v) => {
        salt.push(chars[v % chars.length]);
    });
    return salt.join("");
}

export { DeriveMasterKey, DeriveAuthKey, DeriveEncryptionKey, GenerateSalt };
