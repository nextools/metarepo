extern "C" {
    fn fromJS(x: u32);
}

#[no_mangle]
pub extern "C" fn add(a: u32, b: u32) -> u32 {
    return a + b;
}

#[no_mangle]
pub extern "C" fn fromRust(x: u32) {
    unsafe {
        fromJS(x);
    }
}
