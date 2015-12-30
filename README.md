# Peertransfer

In-browser secure P2P-filetransfer in *three simple steps:*

1. Select the file you want to send.
- Open the generated link on other PCs.
- Download over a **direct (as in peer-to-peer)** and **end-to-end encrypted** line.

*Thus the file will only be available for download as long as the sender keeps his browser tab open.*

[![peertransfer](https://cdn.pbrd.co/images/1nDsnhLI.png)](https://pguth.github.io/peertransfer/)

## Features
- [x] Uses WebRTC for peer-to-peer data connection
- [x] End-to-end encryption
- [x] Authenticate incoming connections
- [x] Display progress for both sender and receiver
- [x] Allow multiple transfers at once
- [x] Cache encrypted data for successive transfers in one session
- [x] Stop sending if the receiver becomes unavailable

# Install

Simply pull the `gh-pages` branch like so. Peertransfer can be used on any (managed) hoster.

```bash
git clone https://github.com/pguth/peertransfer.git
cd peertransfer
git checkout gh-pages

# done and works right out the box if `peertransfer/index.html`
# etc. can be accessed through the web.
```


# Tech in focus
- WebRTC wrapped by [PeerJS](https://github.com/peers/peerjs).
- [Stanford Javascript Crypto Library](https://github.com/bitwiseshiftleft/sjcl)

# Influences & sources
- HTML/CSS forked from [Creating a File Encryption App with JavaScript](http://tutorialzine.com/2013/11/javascript-file-encrypter/).
- Code inspired by [oro-chat](https://github.com/MyBoon/oro-chat).

# Related &|| noteable
- **[My presentation slides](https://slides.com/pguth/peertransfer)**
- **A variation of peertransfer I wrote: [peermesh](https://github.com/pguth/peermesh)**
- [sharedrop](https://github.com/cowbell/sharedrop) "HTML5 clone of Apple's AirDrop - easy P2P file transfer powered by WebRTC"
- [ShareFest](https://github.com/Peer5/ShareFest) "Web based p2p file sharing built on WebRTC Data Channels API"
- [serverless-webrtc](https://github.com/cjb/serverless-webrtc/) "A demo of using WebRTC with no signaling server."
- [WebTorrent](https://github.com/feross/webtorrent) "Streaming torrent client for node & the browser"
- [OnionShare](https://github.com/micahflee/onionshare) "Securely and anonymously share a file of any size"
- [FilePizza](https://github.com/kern/filepizza) "Peer-to-peer file transfers in your browser"

***

[![GNU Affero General Public License](https://www.gnu.org/graphics/agplv3-155x51.png)](http://zedshaw.com/archive/why-i-algpl/)
[![Developer using Firefox Developer](https://affiliates.mozilla.org/media/uploads/image_banners/a47240839834560ba213f2ed7df82697d6bc7766.png)](https://www.mozilla.org/en-US/firefox/channel/#developer?utm_source=firefox-affiliates&utm_medium=banner&utm_campaign=aff-desktop-download-aurora)
[![soma fm: DEF CON Radio](http://somafm.com/img/defcon120.png)](http://somafm.com/player/#/now-playing/defcon)
