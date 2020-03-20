# \#iorestoacasa - Coronavirus ITALIA 2020
[![Website shields.io](https://img.shields.io/website-up-down-green-red/http/shields.io.svg)](https://io-restoacasa.web.app/) 

Seguendo quanto è stato fatto dalla [comunità cinese di Whuan](https://community.wuhan2020.org.cn/it-it/), vogliamo realizzare un servizio messo a disposizione di tutti gli Italiani, che permetta di avere in un unico posto informazioni in tempo reale relative ad ospedali, servizi di approvvigionamento, donazioni, comportamenti da adottare e molto altro.

"Siamo alla ricerca di tutti coloro che desiderano dare un contributo alla campagna contro il coronavirus, in modo che tutte le persone che possiedono le adeguate competenze possano contribuire al lavoro di sviluppo nell’ambito delle tematiche ad esse pertinenti e quindi, in accordo con la cultura della comunità Open Source, al raggiungimento del successo attraverso un approccio di cooperazione autogestita."

Possono partecipare tutti: programmatori, product manager, progettisti, project manager, analisti dati, raccoglitori di informazioni, traduttori, operatori di comunicazione, studenti, ecc.

Visita il sito web https://io-restoacasa.web.app/

![Screenshot](https://github.com/grausof/iorestoacasa/blob/master/screenshot.png?raw=true)

## Come collaborare

Abbiamo aperto un canale su [slack](https://join.slack.com/t/iorestoacasa/shared_invite/zt-cq04uaom-g0x4XaR1Ajw32sKP2reckg) sul quale possiamo scambiarci nuove idee, integrazioni, proposte di miglioramento ecc.

## Come lanciare l'ambiente in locale
```
git clone https://github.com/grausof/iorestoacasa.git
cd iorestoacasa
yarn install
mkdir src/environments
```
nella cartella src/environments creare i file environment.ts:
```
export const environment = {
    production: false,
    firebase: {
        apiKey: "",
        authDomain: "",
        databaseURL: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: "",
        appId: "",
        measurementId: ""
      }
  };
```
e environment.prod.ts con lo stesso contenuto avendo l'accortezza di impostare l'attributo production su true.
Infine è possibile lanciare l'app:
```
yarn start
```
## Docker
E' possibile lanciare l'ambiente di produzione anche sfruttando l'immagine Docker.
Eseguire la build dell'immagine tramite il seguente comando:
```
docker build -t iorestoacasa . 
```
e poi lanciare il server
```
docker run -p 8080:80 -d  iorestoacasa
```
la piattaforma sarà quindi raggiungibile all'indirizzo: http://127.0.0.1:8080


## Live site

https://io-restoacasa.web.app/

## Tutti insieme uniti, ce la faremo !
[![ForTheBadge built-with-love](http://ForTheBadge.com/images/badges/built-with-love.svg)](https://github.com/grausof/iorestoacasa)
