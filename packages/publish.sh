echo 'xxxxxxxxx    publish types    xxxxxxxxx'
cd types
yarn
yarn prepublishOnly
npm publish
cd ..
echo 'xxxxxxxxx    publish types  successfully xxxxxxxxx'
echo ''


echo 'xxxxxxxxx    publish contracts    xxxxxxxxx'
cd contracts
yarn
yarn prepublishOnly
npm publish
cd ..
echo 'xxxxxxxxx    publish contracts successfully xxxxxxxxx'
echo ''


echo 'xxxxxxxxx    publish events   xxxxxxxxx'
cd events
yarn
yarn prepublishOnly
npm publish
cd ..
echo 'xxxxxxxxx    publish events successfully xxxxxxxxx'
echo ''



echo 'xxxxxxxxx    publish hexgen   xxxxxxxxx'
cd hexgen
yarn
yarn prepublishOnly
npm publish
cd ..
echo 'xxxxxxxxx    publish hexgen successfully xxxxxxxxx'



echo ''
echo 'xxxxxxxxx    publish constants   xxxxxxxxx'
cd constants
yarn
yarn prepublishOnly
npm publish
cd ..
echo 'xxxxxxxxx    publish constants successfully xxxxxxxxx'
echo ''



echo 'xxxxxxxxx    publish hashing   xxxxxxxxx'
cd hashing
yarn
yarn prepublishOnly
npm publish
cd ..
echo 'xxxxxxxxx    publish hashing successfully xxxxxxxxx'
echo ''



echo 'xxxxxxxxx    publish serde    xxxxxxxxx'
cd serde
yarn
yarn prepublishOnly
npm publish
cd ..
echo 'xxxxxxxxx    publish serde successfully xxxxxxxxx'




echo 'xxxxxxxxx    publish network   xxxxxxxxx'
cd network
yarn
yarn prepublishOnly
npm publish
cd ..
echo 'xxxxxxxxx    publish network successfully xxxxxxxxx'



echo 'xxxxxxxxx    publish gamelogic   xxxxxxxxx'

cd gamelogic
yarn
yarn prepublishOnly
npm publish
cd ..
echo 'xxxxxxxxx    publish gamelogic successfully xxxxxxxxx'
echo ''




echo 'xxxxxxxxx    publish ui    xxxxxxxxx'
cd ui
yarn
yarn prepublishOnly
npm publish
cd ..
echo 'xxxxxxxxx    publish ui successfully xxxxxxxxx'
echo ''




echo 'xxxxxxxxx    publish snarks    xxxxxxxxx'
cd snarks
yarn
yarn prepublishOnly

npm publish
cd ..
echo 'xxxxxxxxx    publish snarks successfully xxxxxxxxx'
echo ''


echo 'xxxxxxxxx    publish whitelist   xxxxxxxxx'
cd whitelist
yarn
yarn prepublishOnly
npm publish
cd ..
echo 'xxxxxxxxx    publish whitelist successfully xxxxxxxxx'
echo ''


echo 'xxxxxxxxx    publish settings    xxxxxxxxx'
cd settings
yarn
yarn prepublishOnly
npm publish
cd ..
echo 'xxxxxxxxx    publish settings successfully xxxxxxxxx'
echo ''


echo ''
echo 'xxxxxxxxx    publish procedural   xxxxxxxxx'
cd procedural
yarn
yarn prepublishOnly
npm publish
cd ..
echo 'xxxxxxxxx    publish procedural successfully xxxxxxxxx'
echo ''



echo 'xxxxxxxxx    publish renderer   xxxxxxxxx'
cd renderer
yarn
yarn prepublishOnly
npm publish
cd ..
echo 'xxxxxxxxx    publish renderer successfully xxxxxxxxx'
echo ''






