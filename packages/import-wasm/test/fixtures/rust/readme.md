```
brew install rustup
rustup-init --component rustfmt --target wasm32-unknown-unknown --default-host x86_64-apple-darwin --default-toolchain stable --no-modify-path -y
export PATH="$HOME/.cargo/bin:$PATH"
cargo install wasm-gc
cargo build --target wasm32-unknown-unknown --release
wasm-gc target/wasm32-unknown-unknown/release/rust.wasm -o pkg/rust.wasm
```
