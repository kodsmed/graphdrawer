# Kodkvalitetskrav

## Instruktioner

Skapa en tabell över fem namn på identifierare (Ex. namn på klasser, metoder/funktioner och variabler) som finns i ditt publika interface hos modulen. Det publika interfacet är alltså den kod som andra programmerare ska använda. Utgå ifrån kapitel-2s titlar och ange de viktigaste “reglerna” som applicerats eller skulle kunna appliceras på just ditt namn. Försök variera regler mellan namnen så att inte alla har samma titlar applicerade. Visa upp att ni förstår flera regler och inte bara ett par.

Ange även en kort reflektion kring innehållet i kapitel 2. Ni kanske upptäcker en brist hos er tidigare namngivning, ni kanske inte håller med någon av “reglerna” från kursboken. Jag ser hellre att ni hittar och reflekterar över era brister än att ni döljer dem.

## Tabell

| Identifierare | Regel | Reflektion |
| --- | --- | --- |
| GraphDrawer | Klassnamn ska vara substantiv | GraphDrawer är en sak, att ge den ett enhets namn kändes rimligt eftersom den utgör komponenten. |
| | Avoid Missinformation | Den hette initialt GraphDrawer2000, men jag döpte om den efter senaste seminariet. |
| renderArrayAsGraph | Metodnamn ska vara verb | metodens namn ger uttryck för vad den gör. |
| | Använd intentionsbaserad namngivning |  metodens namn ger uttryck för vad den gör. |
| | Tillför meningsfull context | metodens namn avslöjar att den förväntar sig en array som indata. |
| FontSetting.title | Använd intentionsbaserad namngivning | detta är inte den bästa namngivningen. Gettern returnerar en cxt.font sträng exempelvis '12px Arial' vilket inte är uppenbart från namnet. |
| verifyDatasetIntegrity | Metodnamn ska vara verb | metodens namn ger uttryck för vad den gör, validerar arrayen dataset och dess ingående delar.|
| | Använd intentionsbaserad namngivning | metodens namn ger uttryck för vad den gör. |
| | Ordvitsa inte | nope, helt humorbefriat. |
| nonMagicZero | Don't be cute | hmmm, ja, kanske. Skall man vara helt ärlig så hade origo varit ett bättre namn. |

## Reflektion  // TODO: skriv om, skall bara vara om kapitel 2, och inte om min kod, samt en halv sida långt

Kapitel två är 13 sidor med utfyllnad, och skulle troligtvis kunna sammanfattas till en eller ett par meningar... om jag skall försöka på rak arm; "dina namn skall vara relevanta i sammanhanget", mer utvecklat bör ett variabelnamn tala om vad variabeln representerar och kanske även innehåller: ex. "numberOfStepsOnYAxis" är bättre än "steps" eller "ySteps". Klasser är Objekt och skall därför ha sak/enhetsnamn, metoder gör saker och bör därför innehålla verb.

Det finns namn jag inte är super nöjd med, ex heightStep - hur många pixlar varje värdeökning skall innebära... yPixelsToValueRatio?
Överlag tycker jag ändå att mina namn är bra men med lite mer erfarenhet hade de kunnat bli bättre, min stora bane är nog Don't be cute regeln, speciellt i kombination med saker jag tycker är onödiga att behöva förklara... så som värdet 0.
