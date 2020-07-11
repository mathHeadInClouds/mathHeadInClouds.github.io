    var _entities = {
        amp : 38,  // &
        lt  : 60,  // <
        gt  : 62,  // >
        umlauts : { // ISO-8859-1
            Agrave   : 192, // À Capital a with grave accent
            Aacute   : 193, // Á Capital a with acute accent
            Acirc    : 194, // Â Capital a with circumflex accent
            Atilde   : 195, // Ã Capital a with tilde
            Auml     : 196, // Ä Capital a with umlaut
            Aring    : 197, // Å Capital a with ring
            AElig    : 198, // Æ Capital ae
            Ccedil   : 199, // Ç Capital c with cedilla
            Egrave   : 200, // È Capital e with grave accent
            Eacute   : 201, // É Capital e with acute accent
            Ecirc    : 202, // Ê Capital e with circumflex accent
            Euml     : 203, // Ë Capital e with umlaut
            Igrave   : 204, // Ì Capital i with grave accent
            Iacute   : 205, // Í Capital i with accute accent
            Icirc    : 206, // Î Capital i with circumflex accent
            Iuml     : 207, // Ï Capital i with umlaut
            ETH      : 208, // Ð Capital eth (Icelandic)
            Ntilde   : 209, // Ñ Capital n with tilde
            Ograve   : 210, // Ò Capital o with grave accent
            Oacute   : 211, // Ó Capital o with accute accent
            Ocirc    : 212, // Ô Capital o with circumflex accent
            Otilde   : 213, // Õ Capital o with tilde
            Ouml     : 214, // Ö Capital o with umlaut
            Oslash   : 216, // Ø Capital o with slash
            Ugrave   : 217, // Ù Capital u with grave accent
            Uacute   : 218, // Ú Capital u with acute accent
            Ucirc    : 219, // Û Capital u with circumflex accent
            Uuml     : 220, // Ü Capital u with umlaut
            Yacute   : 221, // Ý Capital y with acute accent
            THORN    : 222, // Þ Capital thorn (Icelandic)
            szlig    : 223, // ß Lowercase sharp s (German)
            agrave   : 224, // à Lowercase a with grave accent
            aacute   : 225, // á Lowercase a with acute accent
            acirc    : 226, // â Lowercase a with circumflex accent
            atilde   : 227, // ã Lowercase a with tilde
            auml     : 228, // ä Lowercase a with umlaut
            aring    : 229, // å Lowercase a with ring
            aelig    : 230, // æ Lowercase ae
            ccedil   : 231, // ç Lowercase c with cedilla
            egrave   : 232, // è Lowercase e with grave accent
            eacute   : 233, // é Lowercase e with acute accent
            ecirc    : 234, // ê Lowercase e with circumflex accent
            euml     : 235, // ë Lowercase e with umlaut
            igrave   : 236, // ì Lowercase i with grave accent
            iacute   : 237, // í Lowercase i with acute accent
            icirc    : 238, // î Lowercase i with circumflex accent
            iuml     : 239, // ï Lowercase i with umlaut
            eth      : 240, // ð Lowercase eth (Icelandic)
            ntilde   : 241, // ñ Lowercase n with tilde
            ograve   : 242, // ò Lowercase o with grave accent
            oacute   : 243, // ó Lowercase o with acute accent
            ocirc    : 244, // ô Lowercase o with circumflex accent
            otilde   : 245, // õ Lowercase o with tilde
            ouml     : 246, // ö Lowercase o with umlaut
            oslash   : 248, // ø Lowercase o with slash
            ugrave   : 249, // ù Lowercase u with grave accent
            uacute   : 250, // ú Lowercase u with acute accent
            ucirc    : 251, // û Lowercase u with circumflex accent
            uuml     : 252, // ü Lowercase u with umlaut
            yacute   : 253, // ý Lowercase y with acute accent
            thorn    : 254, // þ Lowercase thorn (Icelandic)
            yuml     : 255  // ÿ Lowercase y with umlaut
        },
        symbols : {  // ISO-8859-1
            nbsp    : 160, //   Non-breaking space
            iexcl   : 161, // ¡ Inverted exclamation mark
            cent    : 162, // ¢ Cent
            pound   : 163, // £ Pound
            curren  : 164, // ¤ Currency
            yen     : 165, // ¥ Yen
            brvbar  : 166, // ¦ Broken vertical bar
            sect    : 167, // § Section
            uml     : 168, // ¨ Spacing diaeresis
            copy    : 169, // © Copyright
            ordf    : 170, // ª Feminine ordinal indicator
            laquo   : 171, // « Opening/Left angle quotation mark
            not     : 172, // ¬ Negation
            shy     : 173, //   Soft hyphen
            reg     : 174, // ® Registered trademark
            macr    : 175, // ¯ Spacing macron
            deg     : 176, // ° Degree
            plusmn  : 177, // ± Plus or minus
            sup2    : 178, // ² Superscript 2
            sup3    : 179, // ³ Superscript 3
            acute   : 180, // ´ Spacing acute
            micro   : 181, // µ Micro
            para    : 182, // ¶ Paragraph
            cedil   : 184, // ¸ Spacing cedilla
            sup1    : 185, // ¹ Superscript 1
            ordm    : 186, // º Masculine ordinal indicator
            raquo   : 187, // » Closing/Right angle quotation mark
            frac14  : 188, // ¼ Fraction 1/4
            frac12  : 189, // ½ Fraction 1/2
            frac34  : 190, // ¾ Fraction 3/4
            iquest  : 191, // ¿ Inverted question mark
            times   : 215, // × Multiplication
            divide  : 247  // ÷ Divide
        },
        math : {
            forall : 8704, // ∀ For all
            part   : 8706, // ∂ Part
            exist  : 8707, // ∃ Exist
            empty  : 8709, // ∅ Empty
            nabla  : 8711, // ∇ Nabla
            isin   : 8712, // ∈ Is in
            notin  : 8713, // ∉ Not in
            ni     : 8715, // ∋ Ni
            prod   : 8719, // ∏ Product
            sum    : 8721, // ∑ Sum
            minus  : 8722, // − Minus
            lowast : 8727, // ∗ Asterisk (Lowast)
            radic  : 8730, // √ Square root
            prop   : 8733, // ∝ Proportional to
            infin  : 8734, // ∞ Infinity
            ang    : 8736, // ∠ Angle
            and    : 8743, // ∧ And
            or     : 8744, // ∨ Or
            cap    : 8745, // ∩ Cap
            cup    : 8746, // ∪ Cup
            int    : 8747, // ∫ Integral
            there4 : 8756, // ∴ Therefore
            sim    : 8764, // ∼ Similar to
            cong   : 8773, // ≅ Congurent to
            asymp  : 8776, // ≈ Almost equal
            ne     : 8800, // ≠ Not equal
            equiv  : 8801, // ≡ Equivalent
            le     : 8804, // ≤ Less or equal
            ge     : 8805, // ≥ Greater or equal
            sub    : 8834, // ⊂ Subset of
            sup    : 8835, // ⊃ Superset of
            nsub   : 8836, // ⊄ Not subset of
            sube   : 8838, // ⊆ Subset or equal
            supe   : 8839, // ⊇ Superset or equal
            oplus  : 8853, // ⊕ Circled plus
            otimes : 8855, // ⊗ Circled times
            perp   : 8869, // ⊥ Perpendicular
            sdot   : 8901  // ⋅  Dot operator
        },
        greek : {
            Alpha    : 913, // Α Alpha
            Beta     : 914, // Β Beta
            Gamma    : 915, // Γ Gamma
            Delta    : 916, // Δ Delta
            Epsilon  : 917, // Ε Epsilon
            Zeta     : 918, // Ζ Zeta
            Eta      : 919, // Η Eta
            Theta    : 920, // Θ Theta
            Iota     : 921, // Ι Iota
            Kappa    : 922, // Κ Kappa
            Lambda   : 923, // Λ Lambda
            Mu       : 924, // Μ Mu
            Nu       : 925, // Ν Nu
            Xi       : 926, // Ξ Xi
            Omicron  : 927, // Ο Omicron
            Pi       : 928, // Π Pi
            Rho      : 929, // Ρ Rho
            Sigma    : 931, // Σ Sigma
            Tau      : 932, // Τ Tau
            Upsilon  : 933, // Υ Upsilon
            Phi      : 934, // Φ Phi
            Chi      : 935, // Χ Chi
            Psi      : 936, // Ψ Psi
            Omega    : 937, // Ω Omega
            alpha    : 945, // α alpha
            beta     : 946, // β beta
            gamma    : 947, // γ gamma
            delta    : 948, // δ delta
            epsilon  : 949, // ε epsilon
            zeta     : 950, // ζ zeta
            eta      : 951, // η eta
            theta    : 952, // θ theta
            iota     : 953, // ι iota
            kappa    : 954, // κ kappa
            lambda   : 955, // λ lambda
            mu       : 956, // μ mu
            nu       : 957, // ν nu
            xi       : 958, // ξ xi
            omicron  : 959, // ο omicron
            pi       : 960, // π pi
            rho      : 961, // ρ rho
            sigmaf   : 962, // ς sigmaf
            sigma    : 963, // σ sigma
            tau      : 964, // τ tau
            upsilon  : 965, // υ upsilon
            phi      : 966, // φ phi
            chi      : 967, // χ chi
            psi      : 968, // ψ psi
            omega    : 969, // ω omega
            thetasym : 977, // ϑ Theta symbol
            upsih    : 978, // ϒ Upsilon symbol
            piv      : 982  // ϖ Pi symbol
        },
        misc : {
            OElig   :  338, // Œ Uppercase ligature OE
            oelig	:  339, // œ Lowercase ligature OE
            Scaron	:  352, // Š Uppercase S with caron
            scaron	:  353, // š Lowercase S with caron
            Yuml	:  376, // Ÿ Capital Y with diaeres
            fnof	:  402, // ƒ Lowercase with hook
            circ	:  710, // ˆ Circumflex accent
            tilde	:  732, // ˜ Tilde
            ensp	: 8194, //   En space
            emsp	: 8195, //   Em space
            thinsp	: 8201, //   Thin space
            zwnj	: 8204, //   Zero width non-joiner
            zwj	    : 8205, //   Zero width joiner
            lrm	    : 8206, //   Left-to-right mark
            rlm	    : 8207, //   Right-to-left mark
            ndash	: 8211, // – En dash
            mdash	: 8212, // — Em dash
            lsquo	: 8216, // ‘ Left single quotation mark
            rsquo	: 8217, // ’ Right single quotation mark
            sbquo	: 8218, // ‚ Single low-9 quotation mark
            ldquo	: 8220, // “ Left double quotation mark
            rdquo	: 8221, // ” Right double quotation mark
            bdquo	: 8222, // „ Double low-9 quotation mark
            dagger	: 8224, // † Dagger
            Dagger	: 8225, // ‡ Double dagger
            bull	: 8226, // • Bullet
            hellip	: 8230, // … Horizontal ellipsis
            permil	: 8240, // ‰ Per mille
            prime	: 8242, // ′ Minutes (Degrees)
            Prime	: 8243, // ″ Seconds (Degrees)
            lsaquo	: 8249, // ‹ Single left angle quotation
            rsaquo	: 8250, // › Single right angle quotation
            oline	: 8254, // ‾ Overline
            euro	: 8364, // € Euro
            trade	: 8482, // ™ Trademark
            larr	: 8592, // ← Left arrow
            uarr	: 8593, // ↑ Up arrow
            rarr	: 8594, // → Right arrow
            darr	: 8595, // ↓ Down arrow
            harr	: 8596, // ↔ Left right arrow
            crarr	: 8629, // ↵ Carriage return arrow
            lceil	: 8968, // ⌈ Left ceiling
            rceil	: 8969, // ⌉ Right ceiling
            lfloor	: 8970, // ⌊ Left floor
            rfloor	: 8971, // ⌋ Right floor
            loz	    : 9674, // ◊ Lozenge
            spades	: 9824, // ♠ Spade
            clubs	: 9827, // ♣ Club
            hearts	: 9829, // ♥ Heart
            diams	: 9830  // ♦ Diamond
        }
    };
