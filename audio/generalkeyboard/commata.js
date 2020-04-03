// commata.js

function comma(vec, explanation, name){
    this.vec = vec;
    var enu = 1;
    var deno = 1;
    if ( vec[0] > 0 ){
        enu *= Math.round(Math.pow(2, vec[0]));
    } else {
        deno *= Math.round(Math.pow(2, -vec[0]));
    }
    if ( vec[1] > 0 ){
        enu *= Math.round(Math.pow(3, vec[1]));
    } else {
        deno *= Math.round(Math.pow(3, -vec[1]));
    }
    if ( vec[2] > 0 ){
        enu *= Math.round(Math.pow(5, vec[2]));
    } else {
        deno *= Math.round(Math.pow(5, -vec[2]));
    }
    if ( vec[3] > 0 ){
        enu *= Math.round(Math.pow(7, vec[3]));
    } else {
        deno *= Math.round(Math.pow(7, -vec[3]));
    }
    if ( vec.length >= 5 ){
        if ( vec[4] > 0 ){
            enu *= Math.round(Math.pow(11, vec[4]));
        } else {
            deno *= Math.round(Math.pow(11, -vec[4]));
        }
    }
    this.val = new fraction(enu, deno);
    this.explanation = explanation;
    this.name = name;
    this.mustBeInKernel = false;
    this.mustNotBeInKernel = false;
    this.showing = false;
    this.cent = this.val.toCent();
    this.complexity = this.val.enu * this.val.deno;
}
function commaLessEqByError(that){
    return this.cent <= that.cent; 
}
function commaLessEqByComplexity(that){
    return this.complexity <= that.complexity;
}
function commaLessEqByComplexity2(arg1, arg2){
    return Commata[arg1].complexity <= Commata[arg2].complexity;
}
function commaLessEqAlphbetically(that){
    return this.name.toUpperCase() <= that.name.toUpperCase();
}
comma.prototype.lessEq = commaLessEqByComplexity;
// http://www.huygens-fokker.org/docs/intervals.html
Commata = {
    slendroDiesis : new comma([-4, -1, 0, 2, 0], "7/6 ~ 8/7", "Slendro diesis"),                 // 49/48
    tritonicDiesis : new comma([1,0,2,-2,0], "10/7 ~ 7/5", "Tritonic diesis"),                   // 50/49 also called Erlich's decatonic comma
    middleMinorThirdsComma : new comma([-1,-3,1,0,1], "11/9 ~ 6/5", "[MiddleMinorThirdsComma]"), // 55/54
    sevenEleven : new comma([3, 0, -1, 1, -1], "7/5 ~ 11/8", "[trito undecimal comma]"),         // 56/55
    septimal : new comma([6,-2,0,-1,0], "8/7 ~ 9/8", "Septimal comma"),                          // 64/63
    syntonic : new comma([-4,4,-1,0,0], "9/8 ~ 10/9", "Syntonic comma"),                         // 81/80
    smallUndecimal : new comma([-1,2,0,-2,1], "11/7 ~ 14/9", "small undecimal comma"),           // 99/98
    ptolemian : new comma([2,-2,2,0,-1], "10/9 ~ 11/10", "Ptolemian comma"),                     // 100/99
    undecimalSeconds : new comma([-3,-1,-1,0,2], "11/10 ~ 12/11", "undecimal seconds comma"),    // 121/120
    smallSeptimal : new comma([1,2,-3,1,0], "7/5 ~ 5/4 * 10/9", "small septimal comma"),         // 126/125  28/25 ~ 10/9
    septolemian : new comma([4, 0, -2, -1, 1], "8/7 * 11/10 ~ 5/4", "Septimal - Ptolemian"),     // 176/175
    septimalKleisma : new comma([-5,2,2,-1,0], "15/14 ~ 16/15", "septimal kleisma"),             // 225/224  8/7 ~ (16/15)^2, 45/32 ~ 7/5, 9/8 ~ 28/25
    neutralThird : new comma([-1,5,0,0,-2], "3/2 ~ (11/9)^2", "neutral third comma"),            // 243/242  
    idunno : new comma([-1, 0, 1, 2, -2], "7/6 ~ (22/21 * 11/10)", "minorBP + neutral third"),   // 245/242
    minorBPdiesis : new comma([0,-5,1,2,0], "(7/6)^2 * 5/2 ~ (3/2)^3", "minor BP diesis"),       // 245/243
    undecimalKleisma : new comma([-7, -1, 1, 1, 1], "11/8 * 5/4 ~ 12/7", "undecimal kleisma"),   // 385/384
    WerckmeistersUndecimalSeptenarianSchisma : new comma([-3,2,-1,2,-1], "21/20 ~ 22/21", "Werckmeister USS"),  // 441/440 Werckmeister's undecimal septenarian Schisma 7/5 * 14/11 ~ (4/3)^2
    swets : new comma([2, 3, 1, -2, -1], "9/7 ~ 7/6 * 11/10", "Swets' comma"),                       // 540/539
    gamelanResidue : new comma([-10, 1, 0, 3, 0], "3/2 ~ (8/7)^3", "gamelan residue"),               // 1029/1024
    orwellian : new comma([6, 3, -1, -3, 0], "8/5 ~ (7/6)^3", "Orwellian comma"),                    // 1728/1715
    breedsma : new comma([-5, -1, -2, 4, 0], "(7/6)^2 * 21/20 ~ 10/7", "Breedsma"),                  // 2401/2400 = 441/440 * 539/540
    lehmerisma : new comma([-4, -3, 2, -1, 2], "25/24 * 22/21 ~ 12/11", "Lehmerisma"),               // 3025/3024 = 121/120 * 125/126 = 225/224 * 242/243
    ragisma : new comma([-1, -7, 4, 1, 0], "(27/25)^2 ~ 7/6", "ragisma"),                            // 4375/4374, 5/4 * 7/6 * (10/9)^3 ~ 2
    schisma : new comma([-15, 8, 1, 0, 0], "(3/2)^8*(5/4) ~ 2^5", "Schisma"),                        // 32805/32768
    maximalDiesis : new comma([1,-5,3,0,0], "(4/3)^2 ~ (6/5)^3", "maximal diesis"),                  // 250/243
    minorDiesis : new comma([7,0,-3,0,0], "2 ~ (5/4)^3", "minor diesis"),                            // 128/125
    avic : new comma([-9, 1, 2, 1, 0], "5/4 ~ 8/7 * 16/15", "Avicenna enharmonic diesis"),           // 525/512
    majorDiesis : new comma([3, 4, -4, 0, 0], "(6/5)^4 ~ 2", "major diesis"),                        // 648/625
    senga : new comma([1, -3, -2, 3, 0], "7/6 ~ (15/14)^2", "senga"),                                // 686/675
    keema : new comma([-5, -3, 3, 1, 0], "7/4 ~ (6/5)^3", "keema"),                                  // 875/864
    undecimalSemicomma : new comma([7, -4, 0, 1, -1], "14/11 * 4 ~ (3/2)^4", "undecimal semicomma"), // 896/891
    diaschisma : new comma([11, -4, -2, 0, 0], "(16/15 * 4/3)^2 ~ 2", "diaschisma"),                 // 2048/2025
    smallDiesis : new comma([-10, -1, 5, 0, 0], "(5/4)^5 ~ 3", "small diesis"),                      // 3125/3072
    majorBPDiesis : new comma([0, -2, 5, -3, 0], "(5/3)^2 ~ (7/5)^3", "major BP diesis"),            // 3125/3087
    middleSecondComma : new comma([6, 0, -5, 2, 0], "(28/25)^2 ~ 5/4", "middle second comma"),       // 3136/3125
    septimalSemi : new comma([5, -4, 3, -2, 0], "10/7 * (10/9)^2 ~ 7/4", "septimal semicomma"),      // 4000/3969
    undecimalSchisma : new comma([5, -1, 3, 0, -3], "4/3 ~ (11/10)^3", "undecimal schisma"),         // 4000/3993
    beta5 : new comma([10, -6, 1, -1, 0], "8/7 * 5/4 * 8 ~ (3/2)^6", "Beta 5, Garibaldi comma"),     // 5120/5103
    undecimalMinorDiesis : new comma([13, -6, 0, 0, -1], "16 ~ (3/2)^6 * 11/8", "undecimal minor diesis"),  // 8192/8019
    kalsima : new comma([-3, 4, -2, -2, 2], "2 ~ (14/11 * 10/9)^2", "kalisma, Gauss' comma"),        // 9801/9800 = 3025/3024 * 4374/4375
    greatBPDiesis : new comma([0, -7, 6, -1, 0], "(5/3)^6 ~ 21", "great BP diesis"),                 // 15625/15309
    kleisma : new comma([-6, -5, 6, 0, 0], "3 ~ (6/5)^6", "kleisma, semicomma majeur"),              // 15625/15552
    doubleAugDiesis : new comma([-14, 3, 4, 0, 0], "5/4 ~ (16/15)^3", "double augmentation diesis"), // 16875/16384
    smallBPDiesis : new comma([0, 3, 4, -5, 0], "8/7 * (15/14)^4 ~ 3/2", "small BP diesis"),         // 16875/16807
    minimalDiesis : new comma([5, -9, 4, 0, 0], "(10/9)^4 ~ 3/2", "minimal diesis"),                 // 20000/19683
    harry : new comma([-13, 10, 0, -1, 0], "(3/2)^10 ~ 32 * 7/4", "Harrison's comma"),               // 59049/57344
    mediumSemi : new comma([2, 9, -7, 0, 0], "(6/5)^7 ~ 2 * (4/3)^2", "medium semicomma"),           // 78732/78125
    landscape : new comma([-4, 6, -6, 3, 0], "(6/5)^6 ~ 2 * (8/7)^3", "Landscape comma"),            // 250047/250000
    pythagorean : new comma([-19, 12, 0, 0, 0], "(3/2)^12 ~ 2^7", "Pythagorean comma"),              // 531441/524288
    wuersch : new comma([17, 1, -8, 0, 0], "4 * 3/2 ~ (5/4)^8", "Würschmidt's comma"),               // 393216/390625
    kleischis : new comma([9, -13, 5, 0, 0], "2 * (10/9)^5 ~ (3/2)^3 ", "kleisma - schisma"),        // 1600000/1594323
    semicomma : new comma([-21, 3, 7, 0, 0], "(5/4)^4 ~ 2 * (16/15)^3", "semicomma, Fokker's comma"),// 2109375/2097152
    beta2 : new comma([25, -14, 0, -1, 0], "(4/3)^14 ~ 32 * 7/4", "Beta 2, septimal schisma"),       // 33554432/33480783
    ampers : new comma([-25, 7, 6, 0, 0], "3/2 ~ (16/15)^6", "Ampersand's comma"),                   // 34171875/33554432
    sycamore : new comma([-16, -6, 11, 0, 0], "(5/4)^11 ~(3/2)^6", "Sycamore comma"),                // 48828125/47775744
    misty : new comma([26, -12, -3, 0, 0], "2^8 ~ (3/2)^12 * (5/4)^3", "Misty comma, diaschisma - schisma"),   // 67108864/66430125
    //pyth19 : new comma([-30, 19, 0, 0, 0], "(3/2)^19 ~ 2^11", "Pythagorean-19 comma"),             // 1162261467/1073741824
    paraKleisma : new comma([8, 14, -13, 0, 0], "(6/5)^13 ~ 8*4/3", "parakleisma"),                  // 1224440064/1220703125
    vishnu : new comma([23, 6, -14, 0, 0], "4/3 ~ (25/24)^7", "Vishnu comma"),                       // 6115295232/6103515625
    semithirds : new comma([38, -2, -15, 0, 0], "16 * (16/15)^2 ~ (5/4)^13", "semithirds comma"),    // 274877906944/274658203125
    blah1  : new comma([-3, 0, 4, -1, -1], '10/7 * (5/4)^2 ~ 2 * 11/10' , 'unknown1'),   // 625/616
    blah2  : new comma([5, 3, 0, -1, -2],  '(12/11)^2 ~ 7/6' , 'unknown2'),              // 864/847
    blah3  : new comma([-2, 0, 3, -3, 1],  '11/4 ~ (7/5)^3' , 'unknown3'),               // 1375/1372
    blah4  : new comma([2, -3, -3, 1, 2],  '2 ~ (15/11)^2 * 15/14' , 'unknown4'),        // 3388/3375
    blah5  : new comma([3, -7, 2, 0, 1],   '(10/9)^2 * 11/9 ~ 3/2' , 'unknown5'),        // 2200/2187
    blah6  : new comma([0, -3, 0, -2, 3],  '4/3 * 11/9 ~ (14/11)^2' , 'unknown6'),       // 1331/1323
    blah7  : new comma([-1, -1, -4, 3, 1], '(7/5)^3 * 11/10 ~ 3' , 'unknown7'),          // 3773/3750
    blah8  : new comma([-8, 4, 1, 1, -1],  '14/11 * 15/8 ~ (4/3)^3' , 'unknown8'),       // 2835/2816
    blah9  : new comma([9, -1, 1, -1, -2], '2 ~ (11/8)^2 * 21/20' , 'unknown9'),         // 2560/2541
    blah10 : new comma([2, 0, 1, -4, 2], '2*8/7 ~ 7/5 (14/11)^2' , 'unknown10'),         // 2420/2401
    blah11 : new comma([-6, 1, -2, 2, 1],  '(7/5)^2 * 11/8 ~ 2 * 4/3' , 'unknown11'),    // 1617/1600
    blah12 : new comma([10, 1, -2, 0, -2], '3 ~(11/8 * 5/4)^2' , 'unknown12'),           // 3072/3025
    blah13 : new comma([9, -2, -4, 0, 1],  '(16/15)^2 * 11/10 ~ 5/4' , 'unknown13'),     // 5632/5625
    blah14 : new comma([8, -9, 0, 1, 1],   '(4/3)^5 * 11/9 ~ 4 * 9/7' , 'unknown14'),    // 19712/19683
    blah15 : new comma([-1, 7, -1, -4, 1], '(9/7)^3 * 11/10 ~ 7/3' , 'unknown15'),       // 24057/24010
    blah16 : new comma([1, -4, 5, -1, -1], '10/7 * 16/11 ~ (6/5)^4' , 'unknown16'),      // 6250/6237
    blah17 : new comma([-6, 6, -3, 0, 1],  '11/8 ~ (10/9)^3' , 'unknown17'),             // 8019/8000
    blah18 : new comma([14, -3, -1, 0, -2], '8 ~ (3/2)^3 * 5/4 * (11/8)^2' , 'unknown18'),      // 16384/16335
    blah19 : new comma([11, 1, -3, -2, 0],  '(8/7)^2 ~ 5/4 * 25/24' , 'unknown19'),             // 6144/6125
    blah20 : new comma([7, -2, -1, -3, 2],  '2*8/7 ~ (14/11)^2 * 5/4 * 9/8' , 'unknown20'),     // 15488/15435
    blah21 : new comma([5, -7, -1, 3, 0],   '(4/3)^3 ~ 10/7 * (9/7)^2' , 'unknown21'),          // 10976/10935
    blah22 : new comma([2, 1, 2, 2, -4], '(14/11)^2 ~ 4/3 * (11/10)^2' , 'unknown22'),          // 14700/14641
    blah23 : new comma([-2, -6, -1, 0, 4],  '(11/9)^3 * 11/10 ~ 2' , 'unknown23'),              // 14641/14580
    blah24 : new comma([8, 3, -4, 0, -1],  '(6/5)^3 ~ 5/4 11/8' , 'unknown24'),                 // 6912/6875
    blah25 : new comma([0, 1, 5, -1, -3],  '15/8 ~ 7/5 * (11/10)^3' , 'unknown25'),             // 9375/9317
    blah26 : new comma([4, -2, -1, 3, -2], '7/5 * (14/11)^2 ~ (3/2)^2' , 'unknown26'),          // 5488/5445
    blah27 : new comma([-1, 2, -4, 5, -2], '(21/20)^2*(7/5)^2*14/11 ~ 11/4' , 'unknown27'),     // 151263/151250
    blah28 : new comma([-2, -5, 0, 6, -2], '(14/11)^2 * (7/6)^4 ~ 3' , 'unknown28'),            // 117649/117612
    blah29 : new comma([-7, 1, 0, -3, 4],  '11/8 * 3/2 ~ (14/11)^3' , 'unknown29'),             // 43923/43904
    blah30 : new comma([-8, 3, -4, 2, 2],  '(11/10 * 7/5)^2 ~ (4/3)^3' , 'unknown30'),          // 160083/160000
    blah31 : new comma([17, -5, 0, -2, -1],'(4/3)^5 ~ (7/4)^2 * 11/8' , 'unknown31'),           // 131072/130977
    blah32 : new comma([-9, -4, 0, 3, 2],  '(11/9)^2 ~ (8/7)^3' , 'unknown32'),                 // 41503/41472      
    ennealimmal : new comma([1, -27, 18, 0, 0], "2 * (4/3)^9 ~ (6/5)^18", "ennealimmal comma"), // 7629394531250/7625597484987
    tone19 : new comma([-14, -19, 19, 0, 0], "(6/5)^19 ~ 2^5", "'19-tone' comma"),              // 19042491875328/19073486328125
    monzisma : new comma([54, -37, 2, 0, 0], "2^21 ~ (3/2)^35 * (6/5)^2", "monzisma"),  // 450359962737049600/450283905890997363
    //tone41 : new comma([65, -41, 0, 0, 0], "", "'41-tone' comma"),
    //mercator : new comma([-84, 53, 0, 0, 0], "", "Mercator's comma"),
    /*blah33 : new comma([51, -13, -1, -10, 0] , '' , 'unknown33'),  // 2251799813685248/2251783932057135
    blah34 : new comma([1, -15, -18, 23, 0] , '' , 'unknown34'),  // 54737494680161832686/54736736297607421875
    blah35 : new comma([10, -43, 19, 5, 0] , '' , 'unknown35'),  // 328261718750000000000/328256967394537077627
    blah36 : new comma([-58, 43, -8, 3, 0] , '' , 'unknown36'),  // 112592139816326217626061/112589990684262400000000
    blah37 : new comma([-7, 30, -9, -7, 0] , '' , 'unknown37'),  // 205891132094649/205885750000000
    blah38 : new comma([2, 2, 28, -25, 0] , '' , 'unknown38'),  // 1341104507446289062500/1341068619663964900807
    blah39 : new comma([44, 17, -10, -17, 0] , '' , 'unknown39'),  // 2271857773302207479808/2271782363156318359375
    blah40 : new comma([-48, 0, 11, 8, 0] , '' , 'unknown40'),  // 281484423828125/281474976710656
    blah41 : new comma([-6, 15, -27, 16, 0] , '' , 'unknown41'),  // 476856230080661776107/476837158203125000000
    blah42 : new comma([3, -13, 10, -2, 0] , '' , 'unknown42'),  // 78125000/78121827
    blah43 : new comma([45, 2, -28, 6, 0] , '' , 'unknown43'),  // 37254655726910963712/37252902984619140625
    blah44 : new comma([54, -26, 9, -12, 0] , '' , 'unknown44'),  // 35184372088832000000000/35182694956309450917129
    blah45 : new comma([4, -28, -8, 21, 0] , '' , 'unknown45'),  // 8936733825332544112/8936247052719140625
    blah46 : new comma([-55, 30, 2, 1, 0] , '' , 'unknown46'),  // 36030948116563575/36028797018963968
    blah47 : new comma([-4, 17, 1, -9, 0] , '' , 'unknown47'),  // 645700815/645657712
    blah48 : new comma([47, 4, 0, -19, 0] , '' , 'unknown48'),  // 11399736556781568/11398895185373143
    blah49 : new comma([-45, -13, 21, 6, 0] , '' , 'unknown49'),  // 56099414825439453125/56095253661782900736
    blah50 : new comma([-3, 2, -17, 14, 0] , '' , 'unknown50'),  // 6104007655641/6103515625000
    blah51 : new comma([48, -11, -18, 4, 0] , '' , 'unknown51'),  // 675821419082285056/675762176513671875
    blah52 : new comma([7, -41, 2, 19, 0] , '' , 'unknown52'),  // 36476464593194057600/36472996377170786403
    blah53 : new comma([-1, 4, 11, -11, 0] , '' , 'unknown53'),  // 3955078125/3954653486
    blah54 : new comma([41, 19, -27, -3, 0] , '' , 'unknown54'),  // 2555839994964983414784/2555549144744873046875
    blah55 : new comma([0, -11, -7, 12, 0] , '' , 'unknown55'),  // 13841287201/13839609375
    blah56 : new comma([-7, 19, -16, 5, 0] , '' , 'unknown56'),  // 19534128475869/19531250000000
    blah57 : new comma([2, -9, 21, -13, 0] , '' , 'unknown57'),  // 1907348632812500/1907066391840981
    blah58 : new comma([44, 6, -17, -5, 0] , '' , 'unknown58'),  // 12824703626379264/12822723388671875
    blah59 : new comma([3, -24, 3, 10, 0] , '' , 'unknown59'),  // 282475249000/282429536481
    blah60 : new comma([-46, -9, 32, -5, 0] , '' , 'unknown60'),  // 23283064365386962890625/23278837735644079325184
    blah61 : new comma([47, -7, -7, -7, 0] , '' , 'unknown61'),  // 140737488355328/140710042265625
    blah62 : new comma([40, 23, -16, -14, 0] , '' , 'unknown62'),  // 103511519796081828298752/103488628059234619140625
    blah63 : new comma([-8, 23, -5, -6, 0] , '' , 'unknown63'),  // 94143178827/94119200000
    blah64 : new comma([43, 10, -6, -16, 0] , '' , 'unknown64'),  // 519400496868360192/519264540150015625
    blah65 : new comma([2, -20, 14, -1, 0] , '' , 'unknown65'),  // 24414062500/24407490807
    blah66 : new comma([44, -5, -24, 7, 0] , '' , 'unknown66'),  // 14487921671576485888/14483928680419921875
    blah67 : new comma([-5, 10, 5, -8, 0] , '' , 'unknown67'),  // 184528125/184473632
    blah68 : new comma([46, -3, 4, -18, 0] , '' , 'unknown68'),  // 43980465111040000/43967167143582123
    blah69 : new comma([-4, -5, -13, 15, 0] , '' , 'unknown69'),  // 4747561509943/4746093750000
    blah70 : new comma([-2, -3, 15, -10, 0] , '' , 'unknown70'),  // 30517578125/30507326892
    blah71 : new comma([40, 12, -23, -2, 0] , '' , 'unknown71'),  // 584325558976905216/584125518798828125
    blah72 : new comma([-1, -18, -3, 13, 0] , '' , 'unknown72'),  // 96889010407/96855122250
    blah73 : new comma([-8, 12, -12, 6, 0] , '' , 'unknown73'),  // 62523502209/62500000000
    blah74 : new comma([43, -1, -13, -4, 0] , '' , 'unknown74'),  // 8796093022208/8792724609375
    blah75 : new comma([46, -14, -3, -6, 0] , '' , 'unknown75'),  // 70368744177664/70338939985125
    blah76 : new comma([-12, 29, -11, -3, 0] , '' , 'unknown76'),  // 68630377364883/68600000000000
    blah77 : new comma([39, 16, -12, -13, 0] , '' , 'unknown77'),  // 23665185138564661248/23654543556396484375
    blah78 : new comma([-2, -14, 8, 2, 0] , '' , 'unknown78'),  // 19140625/19131876
    blah79 : new comma([-9, 16, -1, -5, 0] , '' , 'unknown79'),  // 43046721/43025920
    blah80 : new comma([42, 3, -2, -15, 0] , '' , 'unknown80'),  // 118747255799808/118689037748575
    blah81 : new comma([-6, 3, 9, -7, 0] , '' , 'unknown81'),  // 52734375/52706752
    blah82 : new comma([-5, -12, -9, 16, 0] , '' , 'unknown82'),  // 33232930569601/33215062500000
    blah83 : new comma([39, 5, -19, -1, 0] , '' , 'unknown83'),  // 133590662774784/133514404296875
    blah84 : new comma([42, -8, -9, -3, 0] , '' , 'unknown84'),  // 4398046511104/4395357421875
    blah85 : new comma([-6, -8, 2, 5, 0] , '' , 'unknown85'),  // 420175/419904
    blah86 : new comma([38, 9, -8, -12, 0] , '' , 'unknown86'),  // 5410421842378752/5406752812890625
    blah87 : new comma([-10, 9, 3, -4, 0] , '' , 'unknown87'),  // 2460375/2458624
    blah88 : new comma([41, -4, 2, -14, 0] , '' , 'unknown88'),  // 54975581388800/54936068900769
    blah89 : new comma([-7, -4, 13, -6, 0] , '' , 'unknown89'),  // 1220703125/1219784832
    blah90 : new comma([35, 11, -25, 2, 0] , '' , 'unknown90'),  // 298249504061128704/298023223876953125
    blah91 : new comma([34, 15, -14, -9, 0] , '' , 'unknown91'),  // 246512345193381888/246298870849609375
    blah92 : new comma([-14, 15, -3, -1, 0] , '' , 'unknown92'),  // 14348907/14336000
    blah93 : new comma([37, 2, -4, -11, 0] , '' , 'unknown93'),  // 1236950581248/1235829214375
    blah94 : new comma([-11, 2, 7, -3, 0] , '' , 'unknown94'),  // 703125/702464
    blah95 : new comma([34, 4, -21, 3, 0] , '' , 'unknown95'),  // 477308305539072/476837158203125
    blah96 : new comma([37, -9, -11, 1, 0] , '' , 'unknown96'),  // 962072674304/961083984375
    blah97 : new comma([33, 8, -10, -8, 0] , '' , 'unknown97'),  // 56358560858112/56296884765625
    blah98 : new comma([36, -5, 0, -10, 0] , '' , 'unknown98'),  // 68719476736/68641485507
    blah99 : new comma([-12, -5, 11, -2, 0] , '' , 'unknown99'),  // 48828125/48771072
    blah100 : new comma([29, 14, -16, -5, 0] , '' , 'unknown100'),  // 2567836929097728/2564544677734375
    blah101 : new comma([32, 1, -6, -7, 0] , '' , 'unknown101'),  // 12884901888/12867859375
    blah102 : new comma([35, -12, 4, -9, 0] , '' , 'unknown102'),  // 21474836480000/21445561257687
    blah103 : new comma([31, 5, 5, -18, 0] , '' , 'unknown103'),  // 1630745395200000/1628413597910449
    blah104 : new comma([35, -23, -3, 3, 0] , '' , 'unknown104'),  // 11785390260224/11767897353375
    blah105 : new comma([28, 7, -12, -4, 0] , '' , 'unknown105'),  // 587068342272/586181640625
    blah106 : new comma([31, -6, -2, -6, 0] , '' , 'unknown106'),  // 2147483648/2144153025
    blah107 : new comma([27, 11, -1, -15, 0] , '' , 'unknown107'),  // 23776267862016/23737807549715
    blah108 : new comma([30, -2, 9, -17, 0] , '' , 'unknown108'),  // 2097152000000000/2093674625884863
    blah109 : new comma([24, 13, -18, -1, 0] , '' , 'unknown109'),  // 26748301344768/26702880859375
    blah110 : new comma([27, 0, -8, -3, 0] , '' , 'unknown110'),  // 134217728/133984375
    blah111 : new comma([26, 4, 3, -14, 0] , '' , 'unknown111'),  // 679477248000/678223072849
    blah112 : new comma([26, -7, -4, -2, 0] , '' , 'unknown112'),  // 67108864/66976875
    blah113 : new comma([22, 10, -3, -11, 0] , '' , 'unknown113'),  // 247669456896/247165842875
    blah114 : new comma([25, -3, 7, -13, 0] , '' , 'unknown114'),  // 2621440000000/2616003280989
    blah115 : new comma([22, -1, -10, 1, 0] , '' , 'unknown115'),  // 29360128/29296875
    blah116 : new comma([21, 3, 1, -10, 0] , '' , 'unknown116'),  // 283115520/282475249
    blah117 : new comma([21, -8, -6, 2, 0] , '' , 'unknown117'),  // 102760448/102515625
    blah118 : new comma([24, -21, 4, 0, 0] , '' , 'unknown118'),  // 10485760000/10460353203
    blah119 : new comma([17, 9, -5, -7, 0] , '' , 'unknown119'),  // 2579890176/2573571875
    blah120 : new comma([20, -4, 5, -9, 0] , '' , 'unknown120'),  // 3276800000/3268642167
    blah121 : new comma([20, -15, -2, 3, 0] , '' , 'unknown121'),  // 359661568/358722675
    blah122 : new comma([16, 2, -1, -6, 0] , '' , 'unknown122'),  // 589824/588245
    blah123 : new comma([19, -11, 9, -8, 0] , '' , 'unknown123'),  // 1024000000000/1021217202747
    blah124 : new comma([12, 8, -7, -3, 0] , '' , 'unknown124'),  // 26873856/26796875
    blah125 : new comma([15, -5, 3, -5, 0] , '' , 'unknown125'),  // 4096000/4084101
    blah126 : new comma([14, -12, 7, -4, 0] , '' , 'unknown126'),  // 1280000000/1275989841
    blah127 : new comma([7, 7, -9, 1, 0] , '' , 'unknown127'),  // 1959552/1953125
    blah128 : new comma([5, 4, 6, -9, 0] , '' , 'unknown128'),  // 40500000/40353607
    blah129 : new comma([1, 10, 0, -6, 0] , '' , 'unknown129'),  // 118098/117649
    blah130 : new comma([-4, 9, -2, -2, 0] , '' , 'unknown130'),  // 19683/19600
    blah131 : new comma([-1, -4, 8, -4, 0] , '' , 'unknown131'),  // 390625/388962
    blah132 : new comma([-9, 8, -4, 2, 0] , '' , 'unknown132'),  // 321489/320000
    blah133 : new comma([21, -5, -2, -3, 0] , '' , 'unknown133'),  // 2097152/2083725
    blah134 : new comma([16, -6, -4, 1, 0] , '' , 'unknown134'),  // 458752/455625
    blah135 : new comma([16, -3, 0, -4, 0] , '' , 'unknown135'),  // 65536/64827
    blah136 : new comma([1, 5, 1, -4, 0] , '' , 'unknown136'),  // 2430/2401*/

    init : function(){
        var initiallyVisible = ["tritonicDiesis", "middleMinorThirdsComma",
            "syntonic", "orwellian", "septimal", "slendroDiesis", "smallUndecimal", "ptolemian", "undecimalSeconds", "sevenEleven", "gamelanResidue", "smallSeptimal",
            "neutralThird", "WerckmeistersUndecimalSeptenarianSchisma", "undecimalKleisma", "septolemian", "idunno", "minorBPdiesis", "septimalKleisma", "swets"
        ];
        initiallyVisible = ["syntonic", "orwellian", "septimal", "slendroDiesis", "smallUndecimal", "ptolemian"];
        for ( var i=0; i<initiallyVisible.length; i++ ){
            this[initiallyVisible[i]].showing = true;
        }
        for ( var id in this ){
            if ( typeof this[id] == "function" ) continue;
            this[id].id = id;
        }
    },
    check4Duplicates : function(){
        var entries = new Array();
        for ( var c in this ){
            if ( typeof this[c] == "function" ) continue;
            entries.push(c);
        }
        for ( var i=0; i<entries.length-1; i++ ){
            for ( var j=i+1; j<entries.length; j++ ){
                if ( arraysEqual(this[entries[i]].vec, this[entries[j]].vec) ){
                    alert("equal: " + entries[i] + " " + entries[j] + " " + this[entries[i]].val.toString());
                }
            }
        }
    }
}
Commata.init();
//Commata.check4Duplicates();
// omitted due to not being in the 11 limit, maybe use later when 13 limit comes in
// 513/512  undevicesimal comma, Boethius' comma
//  715/714  septendecimal bridge comma
// 736/729  vicesimotertial comma
// 750/749  ancient Chinese tempering
// 1053/1024  tridecimal major diesis
//  1216/1215  Eratosthenes' comma
//  1288/1287  triaphonisma
//  1732/1731  approximation to 1 cent
//  2058/2057  xenisma
//  2187/2176  septendecimal comma
//  2200/2197  Parizek comma
//  4096/4095  tridecimal schisma, Sagittal schismina
// 10648/10647 harmonisma
// 19657/19656  greater harmonisma
// 23232/23231  lesser harmonisma
// 1331/1323 --> ???
// square of syntonic comma, do not put in, makes no sense @ all! 6561/6400  mathieuSuperDiesis : new comma([-8, 8, -2, 0, 0], "", "Mathieu superdiesis"),
