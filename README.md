# Peertransfer

In-browser secure P2P-filetransfer in *three simple steps:*

1. Select the file you want to send.
2. Open the generated link on other PCs.
3. Download over a **direct (as in peer-to-peer)** and **end-to-end encrypted** line.

*Thus the file will only be available for download as long as the sender keeps his browser tab open.*

[![peertransfer](https://cdn.pbrd.co/images/1nDsnhLI.png)](https://pguth.github.io/peertransfer/)

- [x] Uses WebRTC for peer-to-peer data connection
- [x] End-to-end encryption (provided by WebRTC)
- [x] Authenticate connections (to protect against IP leakages to the server that is used while initiating WebRTC)

# Install

Simply pull the `gh-pages` branch like so. Peertransfer can be used on any (managed) hoster.

```bash
git clone https://github.com/pguth/peertransfer.git
cd peertransfer
git checkout gh-pages

# done and works right out the box if `peertransfer/index.html`
# etc. can be accessed through the web.
```

# Related &|| noteable
- **[My presentation slides](https://slides.com/pguth/peertransfer)**
- **A variation of peertransfer I wrote: [peermesh](https://github.com/pguth/peermesh)**
- [sharedrop](https://github.com/cowbell/sharedrop) "HTML5 clone of Apple's AirDrop - easy P2P file transfer powered by WebRTC"
- [ShareFest](https://github.com/Peer5/ShareFest) "Web based p2p file sharing built on WebRTC Data Channels API"
- [serverless-webrtc](https://github.com/cjb/serverless-webrtc/) "A demo of using WebRTC with no signaling server."
- [WebTorrent](https://github.com/feross/webtorrent) "Streaming torrent client for node & the browser"
- [OnionShare](https://github.com/micahflee/onionshare) "Securely and anonymously share a file of any size"
- [FilePizza](https://github.com/kern/filepizza) "Peer-to-peer file transfers in your browser"
- HTML/CSS of this project are forked from [Creating a File Encryption App with JavaScript](http://tutorialzine.com/2013/11/javascript-file-encrypter/) ([license](https://tutorialzine.com/license): *"You can use, modify and build upon our code for your (or your clients’) personal and commercial projects with no attribution necessary."*).
