# 9 - Suggest Improvements
Now that you've been working in a trunk based project using many kind of feature flags, you are asked to reflect around your experience.

- What did you like with this work method?

"roddigt" med extra kod, bra struktur för att kunna växla mellan nya och gamla features. 
Risk för merge conflicts ökade, små "tickets" gjorde det enkelt att ändå ta hand om dom. 
Om appen ska fungera olika för olika användare så skulle detta arbetssätt vara väldigt bra, kanske endast flaggas i firebase? 
Att arbeta mot en realtime-databas gjorde det möjligt att felsöka även i databasen och inte bara i console, väldigt smidigt. 

- What didn't you like?

Växla mellan parprogramering och ta egna tickets med "lösa" reviews. 
Små och pusha ofta var skönt gjorde att det inte blev så "läskigt"/riskabelt med git och gav en "vara klar"-känsla som vi arbetade bra med i grupp.
Att arbeta i skolan och deligera arbetet/bolla uppgifterna mellan varann.

- Can you come up with a couple of ideas for how to improve the workflow?
	- A change in culture in the dev team?
Bra disiplin, skönt och lätt. Som alltid utveckla hur man kommunicerar en algoritm rent verbalt när man parprogrammerar (svår nöt.)
Inte fastna i en "ticket" när ingen i teamet har en idé på lösning, istället ta ett steg tillbaka läsa på, sova på saken och vara redo nästa gång. Kanske ta något annat emellan.

	- Some improvements to your build pipeline?
Kanske separera actions t.ex. build, deploy, test i separatafiler så dom blir mindre beroende av varann, lättare att se vad som failar, mer överskådligt och lättare underhålla.
Kanske en linther för att kodbasen ska bli mer enhetligt.

	- Some improvements for how to build feature flags? Maybe using a 3rd party tool for it?
Det var lätt att bygga i firebase, men absolut.

Don't forget to [put a green checkmark](README.md) before you continue to the next task!

[Continue to the optional task!](10-implement-suggestions.md)
