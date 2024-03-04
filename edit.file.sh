file_path=/app/node_modules/venom-bot/dist/lib/wapi/wapi.js

# Realiza a manipulação no arquivo
sed -i 's/return await n.processAttachments("0.4.613"===Debug.VERSION?t:t.map((e=>({file:e}))),e,1),n}/return await n.processAttachments("0.4.613"===Debug.VERSION?t:t.map((e=>({file:e}))),e,e),n}/g' $file_path
