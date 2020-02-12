```
cargo build --target wasm32-unknown-unknown --release
cargo install wasm-gc
wasm-gc target/wasm32-unknown-unknown/release/rust.wasm -o pkg/rust.wasm
```
