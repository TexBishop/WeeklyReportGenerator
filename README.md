# WeeklyReportGenerator
This is a Tampermonkey script for Chrome.  To use this, you need to be using Chrome and have the Tampermonkey addon installed.  This script can then be added using Tampermonkey's interface.

This script scrapes a specific website for data, then uses that data to auto-generate a report.  The website is http://deeproute.com/ which is a text-based football simulation game.  The script is set to run on the schedule page for any given league, which contains links to all of the games that have been played.  When on the schedule page, this script will create a "Create Report" button at the bottom of the page.  Pressing this button will run the script.

When the script runs, it scrapes the page for links to all of the games displayed on that particular page, then accesses those links to obtain the statistical data for those games.  If it is currently showing the games for a particular week, it will collect the links to those game results and generate a report for the week's performances.  If it is currently showing all games played for the season, it will collect the links for all of those games and generate a season-to-date report, etc.

Once all of the statitistical data has been collected, it compiles it and generates a report detailing the outstanding performances for the given timeframe that was scraped.  The report is tailored to resemble something a sportscaster would create.  The report itself will appear in a text box below the "Generate Report" button once the script has finished running.  Its format includes scripting/html that is compatible with the forums being used for the game.

Once the report is available in the text box, it can be copied and pasted into the relevant forum on the game's website for posting.

# An example of the pages being scraped for statistical game data 
(http://deeproute.com/?js=boxerinc&viewpbp=0000210000210211913027026)
![Screenshot 2021-06-21 235229](https://user-images.githubusercontent.com/48114601/122865696-67c4d600-d2ec-11eb-8791-2ebfbaaa5fe4.png)

# An example of the text generated for the report

[SIZE=6][FONT=Arial][COLOR=green][B]███ WEEK IN FOCUS ███████████[/B][/COLOR][/FONT][/SIZE]

                    [SIZE=3]With [B]James Landis[/B] and [B]Harry Funk[/B][/SIZE]
                   ______________________________________

[COLOR=green][B]LANDIS[/B][/COLOR]:    Welcome to the week 3 post-game evaluation!
[COLOR=green][B]LANDIS[/B][/COLOR]:    Hey, Harry, have you heard this one?
[COLOR=green][B]FUNK[/B][/COLOR]:       Hell nah, not today.  It's my turn.
[COLOR=green][B]FUNK[/B][/COLOR]:       Your mama is so fat you feed on her junk.
[COLOR=green][B]LANDIS[/B][/COLOR]:    I'll have you know my mother is a fine woman, sir!
[COLOR=green][B]FUNK[/B][/COLOR]:       You think your dad jokes are funny, but this ain't funny?
[COLOR=green][B]LANDIS[/B][/COLOR]:    My jokes are better.  On to the football.  Here are our highlights of the day:


[SIZE=3][COLOR=green][U][B]██PASSING REPORT████[/B][/U][/COLOR][/SIZE]

QB [URL=http://deeproute.com/?js=oneplayer&myleagueno=14&lookatplayer=52827][COLOR=white][B]Leslie Mikkelson[/B][/URL][/COLOR] from team Shreveport Cotton Mouths had the standout performance of the week, in game [URL=http://deeproute.com/?js=boxerinc&viewpbp=0000140000140214403019015][COLOR=white][B]SHV vs. MK[/B][/URL][/COLOR]!
[COLOR=green][B]CMP:[/B][/COLOR][COLOR=red] 31 [/COLOR][COLOR=green][B]ATT:[/B][/COLOR][COLOR=red] 43 [/COLOR][COLOR=green][B]YDS:[/B][/COLOR][COLOR=red] 368 [/COLOR][COLOR=green][B]TDS:[/B][/COLOR][COLOR=red] 4 [/COLOR][COLOR=green][B]INTS:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]SACKED:[/B][/COLOR][COLOR=red] 1 [/COLOR]
[COLOR=green][B]SCRAMBLES:[/B][/COLOR][COLOR=red] 3 [/COLOR][COLOR=green][B]YDS:[/B][/COLOR][COLOR=red] 4 [/COLOR][COLOR=green][B]TDS:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]FMBS:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]LOST:[/B][/COLOR][COLOR=red] 0 [/COLOR]

QB [URL=http://deeproute.com/?js=oneplayer&myleagueno=14&lookatplayer=53967][COLOR=white][B]Paul Macgregor[/B][/URL][/COLOR] from team Portsmouth Penguins also had a strong performance this week, in game [URL=http://deeproute.com/?js=boxerinc&viewpbp=0000140000140214403002030][COLOR=white][B]ATL vs. PP[/B][/URL][/COLOR].
[COLOR=green][B]CMP:[/B][/COLOR][COLOR=red] 30 [/COLOR][COLOR=green][B]ATT:[/B][/COLOR][COLOR=red] 48 [/COLOR][COLOR=green][B]YDS:[/B][/COLOR][COLOR=red] 307 [/COLOR][COLOR=green][B]TDS:[/B][/COLOR][COLOR=red] 4 [/COLOR][COLOR=green][B]INTS:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]SACKED:[/B][/COLOR][COLOR=red] 0 [/COLOR]
[COLOR=green][B]SCRAMBLES:[/B][/COLOR][COLOR=red] 1 [/COLOR][COLOR=green][B]YDS:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]TDS:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]FMBS:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]LOST:[/B][/COLOR][COLOR=red] 0 [/COLOR]

[SIZE=1][COLOR=brown][U][B]BUM QB OF THE WEEK[/B][/U][/COLOR][/SIZE]
QB [URL=http://deeproute.com/?js=oneplayer&myleagueno=14&lookatplayer=53550][COLOR=white][B]Darren Arnette[/B][/URL][/COLOR] from team South Pasadena Hot Mustard stunk up the stadium this week, in game [URL=http://deeproute.com/?js=boxerinc&viewpbp=0000140000140214403014018][COLOR=white][B]HM vs. SCI[/B][/URL][/COLOR].
[COLOR=green][B]CMP:[/B][/COLOR][COLOR=red] 8 [/COLOR][COLOR=green][B]ATT:[/B][/COLOR][COLOR=red] 21 [/COLOR][COLOR=green][B]YDS:[/B][/COLOR][COLOR=red] 81 [/COLOR][COLOR=green][B]TDS:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]INTS:[/B][/COLOR][COLOR=red] 3 [/COLOR][COLOR=green][B]SACKED:[/B][/COLOR][COLOR=red] 1 [/COLOR]
[COLOR=green][B]SCRAMBLES:[/B][/COLOR][COLOR=red] 6 [/COLOR][COLOR=green][B]YDS:[/B][/COLOR][COLOR=red] 15 [/COLOR][COLOR=green][B]TDS:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]FMBS:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]LOST:[/B][/COLOR][COLOR=red] 0 [/COLOR]


[SIZE=3][COLOR=green][U][B]██RUSHING REPORT████[/B][/U][/COLOR][/SIZE]

HB [URL=http://deeproute.com/?js=oneplayer&myleagueno=14&lookatplayer=52019][COLOR=white][B]Paul Greenwood[/B][/URL][/COLOR] from team Youngstown Yakuza had the standout performance of the week, in game [URL=http://deeproute.com/?js=boxerinc&viewpbp=0000140000140214403032004][COLOR=white][B]YY vs. NADS[/B][/URL][/COLOR]!
[COLOR=green][B]ATT:[/B][/COLOR][COLOR=red] 23 [/COLOR][COLOR=green][B]YDS:[/B][/COLOR][COLOR=red] 139 [/COLOR][COLOR=green][B]TDS:[/B][/COLOR][COLOR=red] 1 [/COLOR][COLOR=green][B]FMBS:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]LOST:[/B][/COLOR][COLOR=red] 0 [/COLOR]
[COLOR=green][B]REC:[/B][/COLOR][COLOR=red] 3 [/COLOR][COLOR=green][B]TGT:[/B][/COLOR][COLOR=red] 3 [/COLOR][COLOR=green][B]DRP:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]YDS:[/B][/COLOR][COLOR=red] 20 [/COLOR][COLOR=green][B]YAC:[/B][/COLOR][COLOR=red] 6 [/COLOR][COLOR=green][B]TDS:[/B][/COLOR][COLOR=red] 0 [/COLOR]

HB [URL=http://deeproute.com/?js=oneplayer&myleagueno=14&lookatplayer=52789][COLOR=white][B]Michael Burnett[/B][/URL][/COLOR] from team South Texas Bloodshed also had a strong performance this week, in game [URL=http://deeproute.com/?js=boxerinc&viewpbp=0000140000140214403001029][COLOR=white][B]BLUD vs. CROW[/B][/URL][/COLOR].
[COLOR=green][B]ATT:[/B][/COLOR][COLOR=red] 32 [/COLOR][COLOR=green][B]YDS:[/B][/COLOR][COLOR=red] 142 [/COLOR][COLOR=green][B]TDS:[/B][/COLOR][COLOR=red] 2 [/COLOR][COLOR=green][B]FMBS:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]LOST:[/B][/COLOR][COLOR=red] 0 [/COLOR]
[COLOR=green][B]REC:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]TGT:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]DRP:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]YDS:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]YAC:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]TDS:[/B][/COLOR][COLOR=red] 0 [/COLOR]

[SIZE=1][COLOR=brown][U][B]BUM RB OF THE WEEK[/B][/U][/COLOR][/SIZE]
HB [URL=http://deeproute.com/?js=oneplayer&myleagueno=14&lookatplayer=54330][COLOR=white][B]Mark Pobanz[/B][/URL][/COLOR] from team San Diego Chargers looked lost out there this week, in game [URL=http://deeproute.com/?js=boxerinc&viewpbp=0000140000140214403009021][COLOR=white][B]CHA vs. PHI[/B][/URL][/COLOR].
[COLOR=green][B]ATT:[/B][/COLOR][COLOR=red] 14 [/COLOR][COLOR=green][B]YDS:[/B][/COLOR][COLOR=red] 13 [/COLOR][COLOR=green][B]TDS:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]FMBS:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]LOST:[/B][/COLOR][COLOR=red] 0 [/COLOR]
[COLOR=green][B]REC:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]TGT:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]DRP:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]YDS:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]YAC:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]TDS:[/B][/COLOR][COLOR=red] 0 [/COLOR]


[SIZE=3][COLOR=green][U][B]██RECEIVING REPORT████[/B][/U][/COLOR][/SIZE]

WR [URL=http://deeproute.com/?js=oneplayer&myleagueno=14&lookatplayer=53511][COLOR=white][B]Dean Spence[/B][/URL][/COLOR] from team Shreveport Cotton Mouths had the standout performance of the week, in game [URL=http://deeproute.com/?js=boxerinc&viewpbp=0000140000140214403019015][COLOR=white][B]SHV vs. MK[/B][/URL][/COLOR]!
[COLOR=green][B]REC:[/B][/COLOR][COLOR=red] 9 [/COLOR][COLOR=green][B]TGT:[/B][/COLOR][COLOR=red] 11 [/COLOR][COLOR=green][B]DRP:[/B][/COLOR][COLOR=red] 1 [/COLOR][COLOR=green][B]YDS:[/B][/COLOR][COLOR=red] 163 [/COLOR][COLOR=green][B]YAC:[/B][/COLOR][COLOR=red] 13 [/COLOR][COLOR=green][B]TDS:[/B][/COLOR][COLOR=red] 2 [/COLOR]
[COLOR=green][B]FMBS:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]LOST:[/B][/COLOR][COLOR=red] 0 [/COLOR]

WR [URL=http://deeproute.com/?js=oneplayer&myleagueno=14&lookatplayer=54303][COLOR=white][B]Roland Douglas[/B][/URL][/COLOR] from team Midwest Kings also had a strong performance this week, in game [URL=http://deeproute.com/?js=boxerinc&viewpbp=0000140000140214403019015][COLOR=white][B]SHV vs. MK[/B][/URL][/COLOR].
[COLOR=green][B]REC:[/B][/COLOR][COLOR=red] 10 [/COLOR][COLOR=green][B]TGT:[/B][/COLOR][COLOR=red] 11 [/COLOR][COLOR=green][B]DRP:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]YDS:[/B][/COLOR][COLOR=red] 150 [/COLOR][COLOR=green][B]YAC:[/B][/COLOR][COLOR=red] 23 [/COLOR][COLOR=green][B]TDS:[/B][/COLOR][COLOR=red] 2 [/COLOR]
[COLOR=green][B]FMBS:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]LOST:[/B][/COLOR][COLOR=red] 0 [/COLOR]

[SIZE=1][COLOR=brown][U][B]BUM RECEIVER OF THE WEEK[/B][/U][/COLOR][/SIZE]
WR [URL=http://deeproute.com/?js=oneplayer&myleagueno=14&lookatplayer=55456][COLOR=white][B]James Arancibia[/B][/URL][/COLOR] from team South Pasadena Hot Mustard didn't accomplish much this week, in game [URL=http://deeproute.com/?js=boxerinc&viewpbp=0000140000140214403014018][COLOR=white][B]HM vs. SCI[/B][/URL][/COLOR].
[COLOR=green][B]REC:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]TGT:[/B][/COLOR][COLOR=red] 7 [/COLOR][COLOR=green][B]DRP:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]YDS:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]YAC:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]TDS:[/B][/COLOR][COLOR=red] 0 [/COLOR]
[COLOR=green][B]FMBS:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]LOST:[/B][/COLOR][COLOR=red] 0 [/COLOR]


[SIZE=3][COLOR=green][U][B]██DUAL THREAT████[/B][/U][/COLOR][/SIZE]

Unfortunately, no one qualified for this category this week.


[SIZE=3][COLOR=green][U][B]██DEFENSIVE REPORT████[/B][/U][/COLOR][/SIZE]

We've chosen four players with standout performances to highlight this week.

CB [URL=http://deeproute.com/?js=oneplayer&myleagueno=14&lookatplayer=52967][COLOR=white][B]Douglas Murray[/B][/URL][/COLOR] from team Youngstown Yakuza had the standout performance of the week, in game [URL=http://deeproute.com/?js=boxerinc&viewpbp=0000140000140214403032004][COLOR=white][B]YY vs. NADS[/B][/URL][/COLOR]!
[COLOR=green][B]TCK:[/B][/COLOR][COLOR=red] 5 [/COLOR][COLOR=green][B]MTCK:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]TFL:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]SACK:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]SYRD:[/B][/COLOR][COLOR=red] 0 [/COLOR]
[COLOR=green][B]GCOV:[/B][/COLOR][COLOR=red] 24 [/COLOR][COLOR=green][B]PDEF:[/B][/COLOR][COLOR=red] 4 [/COLOR][COLOR=green][B]INT:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]IYRD:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]ITD:[/B][/COLOR][COLOR=red] 0 [/COLOR]
[COLOR=green][B]FFUM:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]FREC:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]FYRD:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]FTD:[/B][/COLOR][COLOR=red] 0 [/COLOR]

DE [URL=http://deeproute.com/?js=oneplayer&myleagueno=14&lookatplayer=52917][COLOR=white][B]Samuel Taylor[/B][/URL][/COLOR] from team Toledo Uniform Recon Drones made some plays this week, in game [URL=http://deeproute.com/?js=boxerinc&viewpbp=0000140000140214403020016][COLOR=white][B]TURD vs. MUD[/B][/URL][/COLOR].
[COLOR=green][B]TCK:[/B][/COLOR][COLOR=red] 8 [/COLOR][COLOR=green][B]MTCK:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]TFL:[/B][/COLOR][COLOR=red] 1 [/COLOR][COLOR=green][B]SACK:[/B][/COLOR][COLOR=red] 3 [/COLOR][COLOR=green][B]SYRD:[/B][/COLOR][COLOR=red] 10 [/COLOR]
[COLOR=green][B]GCOV:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]PDEF:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]INT:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]IYRD:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]ITD:[/B][/COLOR][COLOR=red] 0 [/COLOR]
[COLOR=green][B]FFUM:[/B][/COLOR][COLOR=red] 1 [/COLOR][COLOR=green][B]FREC:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]FYRD:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]FTD:[/B][/COLOR][COLOR=red] 0 [/COLOR]

CB [URL=http://deeproute.com/?js=oneplayer&myleagueno=14&lookatplayer=51848][COLOR=white][B]Jack Sylva[/B][/URL][/COLOR] from team TexLa Line Rajun Cajun Crawdads made some plays this week, in game [URL=http://deeproute.com/?js=boxerinc&viewpbp=0000140000140214403005025][COLOR=white][B]DADS vs. VUL[/B][/URL][/COLOR].
[COLOR=green][B]TCK:[/B][/COLOR][COLOR=red] 2 [/COLOR][COLOR=green][B]MTCK:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]TFL:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]SACK:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]SYRD:[/B][/COLOR][COLOR=red] 0 [/COLOR]
[COLOR=green][B]GCOV:[/B][/COLOR][COLOR=red] 16 [/COLOR][COLOR=green][B]PDEF:[/B][/COLOR][COLOR=red] 2 [/COLOR][COLOR=green][B]INT:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]IYRD:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]ITD:[/B][/COLOR][COLOR=red] 0 [/COLOR]
[COLOR=green][B]FFUM:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]FREC:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]FYRD:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]FTD:[/B][/COLOR][COLOR=red] 0 [/COLOR]

DE [URL=http://deeproute.com/?js=oneplayer&myleagueno=14&lookatplayer=52140][COLOR=white][B]Leonard Nwabeke[/B][/URL][/COLOR] from team San Diego Chargers made some plays this week, in game [URL=http://deeproute.com/?js=boxerinc&viewpbp=0000140000140214403009021][COLOR=white][B]CHA vs. PHI[/B][/URL][/COLOR].
[COLOR=green][B]TCK:[/B][/COLOR][COLOR=red] 8 [/COLOR][COLOR=green][B]MTCK:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]TFL:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]SACK:[/B][/COLOR][COLOR=red] 3 [/COLOR][COLOR=green][B]SYRD:[/B][/COLOR][COLOR=red] 17 [/COLOR]
[COLOR=green][B]GCOV:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]PDEF:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]INT:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]IYRD:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]ITD:[/B][/COLOR][COLOR=red] 0 [/COLOR]
[COLOR=green][B]FFUM:[/B][/COLOR][COLOR=red] 1 [/COLOR][COLOR=green][B]FREC:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]FYRD:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]FTD:[/B][/COLOR][COLOR=red] 0 [/COLOR]

[SIZE=1][COLOR=brown][U][B]BUM DEFENDER OF THE WEEK[/B][/U][/COLOR][/SIZE]
CB [URL=http://deeproute.com/?js=oneplayer&myleagueno=14&lookatplayer=52971][COLOR=white][B]Jason Marsh[/B][/URL][/COLOR] from team Philadelphia Liberty was a liability on the field this week, in game [URL=http://deeproute.com/?js=boxerinc&viewpbp=0000140000140214403009021][COLOR=white][B]CHA vs. PHI[/B][/URL][/COLOR].
[COLOR=green][B]TCK:[/B][/COLOR][COLOR=red] 8 [/COLOR][COLOR=green][B]MTCK:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]TFL:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]SACK:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]SYRD:[/B][/COLOR][COLOR=red] 0 [/COLOR]
[COLOR=green][B]GCOV:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]PDEF:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]INT:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]IYRD:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]ITD:[/B][/COLOR][COLOR=red] 0 [/COLOR]
[COLOR=green][B]FFUM:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]FREC:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]FYRD:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]FTD:[/B][/COLOR][COLOR=red] 0 [/COLOR]


[SIZE=3][COLOR=green][U][B]██SPECIAL TEAMS REPORT████[/B][/U][/COLOR][/SIZE]

WR [URL=http://deeproute.com/?js=oneplayer&myleagueno=14&lookatplayer=54690][COLOR=white][B]Bobby Morris[/B][/URL][/COLOR] from team Carolina Reapers had the standout performance of the week, in game [URL=http://deeproute.com/?js=boxerinc&viewpbp=0000140000140214403010022][COLOR=white][B]HAMP vs. CAR[/B][/URL][/COLOR]!
[COLOR=green][B]FG:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]FGA:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]XPM:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]XPA:[/B][/COLOR][COLOR=red] 0 [/COLOR]
[COLOR=green][B]PUNTS:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]YDS:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]NET:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]TB:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]BLK:[/B][/COLOR][COLOR=red] 0 [/COLOR]
[COLOR=green][B]KRET:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]KYD:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]KOTD:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]KLNG:[/B][/COLOR][COLOR=red] 0 [/COLOR]
[COLOR=green][B]PRET:[/B][/COLOR][COLOR=red] 5 [/COLOR][COLOR=green][B]PRYD:[/B][/COLOR][COLOR=red] 147 [/COLOR][COLOR=green][B]PRTD:[/B][/COLOR][COLOR=red] 1 [/COLOR][COLOR=green][B]PLNG:[/B][/COLOR][COLOR=red] 60 [/COLOR]

[SIZE=1][COLOR=brown][U][B]BUM SPECIAL TEAMER OF THE WEEK[/B][/U][/COLOR][/SIZE]
ST [URL=http://deeproute.com/?js=oneplayer&myleagueno=14&lookatplayer=54161][COLOR=white][B]Kenneth Poindexter[/B][/URL][/COLOR] from team Las Vegas Raiders incurred the wrath of the fans, in game [URL=http://deeproute.com/?js=boxerinc&viewpbp=0000140000140214403013017][COLOR=white][B]RIR vs. LVR[/B][/URL][/COLOR].
[COLOR=green][B]FG:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]FGA:[/B][/COLOR][COLOR=red] 1 [/COLOR][COLOR=green][B]XPM:[/B][/COLOR][COLOR=red] 2 [/COLOR][COLOR=green][B]XPA:[/B][/COLOR][COLOR=red] 2 [/COLOR]
[COLOR=green][B]PUNTS:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]YDS:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]NET:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]TB:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]BLK:[/B][/COLOR][COLOR=red] 0 [/COLOR]
[COLOR=green][B]KRET:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]KYD:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]KOTD:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]KLNG:[/B][/COLOR][COLOR=red] 0 [/COLOR]
[COLOR=green][B]PRET:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]PRYD:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]PRTD:[/B][/COLOR][COLOR=red] 0 [/COLOR][COLOR=green][B]PLNG:[/B][/COLOR][COLOR=red] 0 [/COLOR]

# This report after having been posted to the given game's forum
![Screenshot 2021-06-21 234611](https://user-images.githubusercontent.com/48114601/122865236-a908b600-d2eb-11eb-826b-9ce3fff28d26.png)



