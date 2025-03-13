# Hópverkefni 1 – Vefforritun 2, vor 2025

## Uppsetning verkefnisins

   github.com/Add1Padd1/Vefforritun_2_hv1

   nota þessar command línur:
   ```
npm install
yarn add @prisma/client
yarn dev
```

```
open http://localhost:3000
```

   .Env á að vera í rót verkefnis og er .env gefið upp í canvas.
   DATABASE_URL=postgresql://...
    JWT_SECRET=...
    SESSION_SECRET=...
    TOKEN_LIFETIME=3600
    BCRYPT_ROUNDS=10
    PORT=3000

Til að gera GET/ aðgerðir á ákveðin rows í sérhverju table þá nægir að gera GET http://localhost:3000/{nafn á table}/{nafn á table í eintölu}_{id}. 
Ef ég vil fá row með id 1 úr table accounts þá myndi ég t.d. gera GET "http://localhost:3000/accounts/account_1". Þetta gildir fyrir allar töflur í db-inu

Það er hægt að gera GET aðgerðir fyrir allar töflur og öll rows í hverri töflu.

Eina taflan þar sem hægt er að gera allar CRUD aðgerðir á er transactions taflan, þar er hægt auk GET aðgerðanna að: 
	DELETE-a flokki byggt á slug í url
	POST-a row í töflunni þar sem þarf að fylla í öll columns nema id (sem auto generate-ar)
 	PATCH-a row í töflunni þar sem þarf að fylla í öll columns nema id (sem auto generate-ar)


## Test gögn

TODO

## Innskráning fyrir admin stjórnanda
	•	Notandi: admin

	•	Lykilorð: password123


## Höfundar
    Arnaldur Ólafsson - aro42@hi.is - github.com/Add1Padd1
    Aron Bjartur Hilmarsson - abh41@hi.is - github.com/aronbjartur


