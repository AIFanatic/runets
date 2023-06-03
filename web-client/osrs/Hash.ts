
import jsbn from "jsbn";

// #[wasm_bindgen]
// pub fn rs_hash_string(s: &str) -> i32 {
//     let mut hash = 0;
//     for c in s.chars() {
//         hash = (hash * 61 + c as i32) - 32;
//     }
//     hash
// }
export function rs_hash_string(s) {
    let hash = 0|0;
    for (let c of s) {
        hash = ((hash * 61 + c.charCodeAt(0)) - 32) | 0;
    }
    return hash;
}

// #[wasm_bindgen]
// pub fn rs_encrypt_bytes(bytes: &[u8], modulus: &str, public_key: &str) -> Box<[u8]> {
//     let modul = modulus.parse().unwrap();
//     let pk = public_key.parse().unwrap();
//     let value = BigInt::from_signed_bytes_be(bytes);
//     return value.modpow(&pk, &modul).to_signed_bytes_be().into_boxed_slice();
// }
export function rs_encrypt_bytes(bytes: Int8Array, modulus: string, pubKey: string): Uint8Array {
    const result = new jsbn.BigInteger(bytes);
    const eB = new jsbn.BigInteger(pubKey);
    const mB = new jsbn.BigInteger(modulus);

    const ret = new Uint8Array(result.modPow(eB, mB).toByteArray());
    return ret;
}


// #[wasm_bindgen]
// pub fn noise(x: i32, y: i32) -> i32 {
//     let xw = Wrapping(x);
//     let yw = Wrapping(y);
//     let mut n = xw + yw * Wrapping(57i32);
//     n ^= n << 13;
//     return (((n * (n * n * Wrapping(15731i32) + Wrapping(789221i32)) + Wrapping(1376312589i32)) & Wrapping(0x7fffffffi32)) >> 19 & Wrapping(255i32)).0;
// }

export function noise(x: number, y: number) {
    let xw = x;
    let yw = y;
    let n = xw + yw * 57|0;
    n ^= n << 13;
    return (((n * (n * n * 15731|0 + 789221|0) + 1376312589|0) & 0x7fffffff|0) >> 19 & 255|0);
}