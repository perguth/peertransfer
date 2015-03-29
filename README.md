[![Stories in Ready](https://badge.waffle.io/pguth/peertransfer.png?label=ready&title=Ready)](https://waffle.io/pguth/peertransfer)
[![License](https://img.shields.io/badge/license-AGPL-blue.svg)](https://www.gnu.org/licenses/why-affero-gpl.html)
[![Code Climate](https://codeclimate.com/github/pguth/peertransfer/badges/gpa.svg)](https://codeclimate.com/github/pguth/peertransfer)
[![Test Coverage](https://codeclimate.com/github/pguth/peertransfer/badges/coverage.svg)](https://codeclimate.com/github/pguth/peertransfer)
[![Gratipay](https://img.shields.io/gratipay/pguth.svg)](https://gratipay.com/pguth/)
[![Flattr](https://raw.githubusercontent.com/balupton/flattr-buttons/master/badge-93x20.png)](https://flattr.com/thing/1583b1a2c05938cc9d945a6b18cea23c)

# Peertransfer

In-browser secure P2P-filetransfer in *three simple steps:*

1. Select the file you want to send.
- Open the generated link on other PCs.
- Download over a **direct (as in peer-to-peer)** and **end-to-end encrypted** line.

*Thus the file will only be available for download as long as the sender keeps his browser tab open.*

# Features
- [x] Uses WebRTC for peer-to-peer data connection
- [x] End-to-end encryption
- [x] Authenticate incoming connections
- [x] Display progress for both sender and receiver
- [x] Allow multiple transfers at once
- [x] Cache encrypted data for successive transfers in one session
- [x] Stop sending if the receiver becomes unavailable

# Tech in focus
- WebRTC wrapped by [PeerJS](https://github.com/peers/peerjs).
- [Stanford Javascript Crypto Library](https://github.com/bitwiseshiftleft/sjcl)

# Influences & sources
- HTML/CSS forked from [Creating a File Encryption App with JavaScript](http://tutorialzine.com/2013/11/javascript-file-encrypter/).
- Code inspired by [oro-chat](https://github.com/MyBoon/oro-chat).

# Related &|| noteable
- [My presentation slides](https://slides.com/pguth/peertransfer)
- [sharedrop](https://github.com/cowbell/sharedrop)
- [ShareFest](https://github.com/Peer5/ShareFest)
- [serverless-webrtc](https://github.com/cjb/serverless-webrtc/)
- [WebTorrent](https://github.com/feross/webtorrent)

***

[![GNU Affero General Public License](https://www.gnu.org/graphics/agplv3-155x51.png)](http://zedshaw.com/archive/why-i-algpl/)
[![js-standard-style](https://raw.githubusercontent.com/feross/standard/master/badge.png)](https://github.com/feross/standard)
[![Developer using Firefox Developer](https://affiliates.mozilla.org/media/uploads/image_banners/a47240839834560ba213f2ed7df82697d6bc7766.png)](https://www.mozilla.org/en-US/firefox/channel/#developer?utm_source=firefox-affiliates&utm_medium=banner&utm_campaign=aff-desktop-download-aurora)
[![soma fm: DEF CON Radio](http://somafm.com/img/defcon120.png)](http://somafm.com/player/#/now-playing/defcon)
