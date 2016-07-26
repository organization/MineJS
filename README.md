# MineJS

![MineJS](http://i.imgur.com/cSZqZpj.png)

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU Lesser General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Lesser General Public License for more details.

	You should have received a copy of the GNU Lesser General Public License
	along with this program.  If not, see <http://www.gnu.org/licenses/>.

__MineJS is a server software for Minecraft : Pocket Edition, MineJS is based Node JS.__

#### [한국어 버전 설명서](https://github.com/organization/MineJS/blob/master/resources/md/kor/%EC%9D%BD%EC%96%B4%EC%A3%BC%EC%84%B8%EC%9A%94.md)

-------------
#### Introducion
    MineJS is a server software for Minecraft : Pocket Edition,
    It is based Node JS. It also derived from PocketMine and Nukkit Project.
-------------
#### What is diffrent?
- It is made by node js. node.js has an event-driven architecture capable of asynchronous I/O. and use node js cluster, so it can be support multi-core environment.
- Conventional PE server platforms there is a problem to can't derive the best performance of the multi-core CPU. Because most software using synchronous i/o. Conventional solution to this problem was a run many servers by the same number of CPU cores. But users does not want to reconnect the server every time select to server different port their self. MineJS is just need only one server. because it has using node js cluster. that's why doesn't matter how many cores exist.
- No need to build or compile, You can run the plug-in and server immediately using their original source files. and doesn't need to program close to apply the update changes. it support /restart command and it can simply update using /update command. (it automatically report version check.)

-------------
#### How to use MineJS?
- Install Node JS 6.x.x -> https://nodejs.org/
- Download Project -> https://github.com/organization/MineJS/archive/master.zip
- In project folder, open terminal and type `node mine`

(Doesn't need npm install, it automatically program works)

-------------
#### Finally comment
    MineJS Project is needed the participation of interested developers.
    If you want to develop this project codes, any time 'Pull Request' please!