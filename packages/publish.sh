echo 'xxxxxxxxx    publish types 1    xxxxxxxxx'
cd types
yarn
yarn prepublishOnly
npm publish
cd ..
echo 'xxxxxxxxx    publish types 1 successfully xxxxxxxxx'
echo ''


echo 'xxxxxxxxx    publish contracts  2  xxxxxxxxx'
cd contracts
yarn
yarn prepublishOnly
npm publish
cd ..
echo 'xxxxxxxxx    publish contracts 2 successfully xxxxxxxxx'
echo ''


echo 'xxxxxxxxx    publish events 3   xxxxxxxxx'
cd events
yarn
yarn prepublishOnly
npm publish
cd ..
echo 'xxxxxxxxx    publish events 3 successfully xxxxxxxxx'
echo ''



echo 'xxxxxxxxx    publish hexgen 4  xxxxxxxxx'
cd hexgen
yarn
yarn prepublishOnly
npm publish
cd ..
echo 'xxxxxxxxx    publish hexgen 4 successfully xxxxxxxxx'



echo ''
echo 'xxxxxxxxx    publish constants  5  xxxxxxxxx'
cd constants
yarn
yarn prepublishOnly
npm publish
cd ..
echo 'xxxxxxxxx    publish constants 5 successfully xxxxxxxxx'
echo ''



echo 'xxxxxxxxx    publish hashing  6 xxxxxxxxx'
cd hashing
yarn
yarn prepublishOnly
npm publish
cd ..
echo 'xxxxxxxxx    publish hashing 6 successfully xxxxxxxxx'
echo ''



echo 'xxxxxxxxx    publish serde   7 xxxxxxxxx'
cd serde
yarn
yarn prepublishOnly
npm publish
cd ..
echo 'xxxxxxxxx    publish serde 7 successfully xxxxxxxxx'




echo 'xxxxxxxxx    publish network  8 xxxxxxxxx'
cd network
yarn
yarn prepublishOnly
npm publish
cd ..
echo 'xxxxxxxxx    publish network 8 successfully xxxxxxxxx'



echo 'xxxxxxxxx    publish gamelogic  9  xxxxxxxxx'

cd gamelogic
yarn
yarn prepublishOnly
npm publish
cd ..
echo 'xxxxxxxxx    publish gamelogic 9 successfully xxxxxxxxx'
echo ''




echo 'xxxxxxxxx    publish ui  10  xxxxxxxxx'
cd ui
yarn
yarn prepublishOnly
npm publish
cd ..
echo 'xxxxxxxxx    publish ui 10 successfully xxxxxxxxx'
echo ''




echo 'xxxxxxxxx    publish snarks  11   xxxxxxxxx'
cd snarks
yarn
yarn prepublishOnly
npm publish
cd ..
echo 'xxxxxxxxx    publish snarks 11 successfully xxxxxxxxx'
echo ''


echo 'xxxxxxxxx    publish whitelist  12 xxxxxxxxx'
cd whitelist
yarn
yarn prepublishOnly
npm publish
cd ..
echo 'xxxxxxxxx    publish whitelist 12 successfully xxxxxxxxx'
echo ''


echo 'xxxxxxxxx    publish settings  13  xxxxxxxxx'
cd settings
yarn
yarn prepublishOnly
npm publish
cd ..
echo 'xxxxxxxxx    publish settings 13 successfully xxxxxxxxx'
echo ''


echo ''
echo 'xxxxxxxxx    publish procedural  14  xxxxxxxxx'
cd procedural
yarn
yarn prepublishOnly
npm publish
cd ..
echo 'xxxxxxxxx    publish procedural  14 successfully xxxxxxxxx'
echo ''



echo 'xxxxxxxxx    publish renderer  15  xxxxxxxxx'
cd renderer
yarn
yarn prepublishOnly
npm publish
cd ..
echo 'xxxxxxxxx    publish renderer 15 successfully xxxxxxxxx'
echo ''






