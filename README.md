# Interconsulta-GID
 GID Aplication

# Configuraçoes necessarias para rodar em ambiente de desenvolvimento:

     # Excluir do .env do frontend: 'NEXT_PUBLIC_API_BASE_URL=https://interconsulta.org', e deixar o .env vazio para acessar a porta 8080 do localhost da sua maquina.

     # Trocar a String de connection do MongoDB 
      de 
     'mongodb+srv://matheusfff02:030503Aa@instacemongointerconsul.1gfrhkw.mongodb.net/'
      para:
     'mongodb+srv://matheusfff02:030503Aa@cluster0.qoa8un4.mongodb.net/'

     # Ir na API de features e descomentar a request pra API de de automaçoes de 'Development' e comentar a de 'Production' para as requests entre as duas apis rodarem localmente em ambiente de desenvolvimento., arquivos para mudar: LoginService, AgendaService, ReuniãoService

     # Mudar a config do Redis na API de Automaçao na propriedade host, trocar o valor de 'redis' para 'localhost'

     # Depois de terminar as features locais mude o dockerfile.front, tire o RUN npm run build e mude o CMD de 'start' para 'dev', apos isso rode o  comando para rodar a stack de containers e ver as novas funcionalidades aplicadas estao funcionando

      - docker-compose up redis back-features back-a frontend --build