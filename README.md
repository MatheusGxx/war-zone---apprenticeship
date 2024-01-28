# Interconsulta-GID
 GID Aplication

# Configuraçoes necessarias para rodar em ambiente de desenvolvimento:

     # Comentar o .env do front para acessar a api de feature na porta 8080 em localhost e nao em interconsulta.org

     # Ir na API de features e descomentar a request pra API de de automaçoes de 'Development' e comentar a de 'Production' para as requests entre as duas apis rodarem localmente em ambiente de desenvolvimento.

     # Depois de terminar as features locais mude o dockerfile.front, tire o RUN npm run build e mude o CMD de 'start' para 'dev', apos isso rode o  comando para rodar a stack de containers e ver as novas funcionalidades aplicadas estao funcionando

      - docker-compose up redis back-features back-a frontend --build