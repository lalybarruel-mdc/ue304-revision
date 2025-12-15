window.REVISION_DATA = {
  meta: { title: "Révisions UE304 Psychopathologie – TD1 à TD5", generated: "2025-12-15" },
  tds: [
    { id:"TD1", name:"Modèle Bio-Psycho-Social (Engel)" },
    { id:"TD2", name:"Classifications (DSM/CIM/CIF) + étude de cas" },
    { id:"TD3", name:"Anamnèse – entretien clinique" },
    { id:"TD4", name:"Psychoéducation + annonce diagnostique" },
    { id:"TD5", name:"Psychopathologie du développement – TND" }
  ],

  flashcards: [
    // TD1
    { td:"TD1", front:"Qu’est-ce que le modèle bio-psycho-social (BPS) ?", back:"Un modèle qui explique santé/maladie comme le résultat d’interactions entre facteurs biologiques, psychologiques et sociaux." },
    { td:"TD1", front:"3 critiques d’Engel au modèle biomédical ?", back:"Dualisme corps/esprit ; réductionnisme/causalité linéaire ; oubli de l’expérience subjective + de la relation de soin." },
    { td:"TD1", front:"Non-réductionnisme : définition", back:"Le tout est plus que la somme des parties : comprendre un élément via sa relation au système." },
    { td:"TD1", front:"Précurseurs cités du modèle BPS", back:"Adolf Meyer (psychobiologie) et Roy Grinker (théorie des systèmes, terme « bio-psycho-social »)." },
    { td:"TD1", front:"Une limite du modèle BPS", back:"Peut être jugé trop éclectique ; mais il ouvre l’analyse et évite le dogmatisme." },

    // TD2
    { td:"TD2", front:"Symptômes vs signes", back:"Symptômes = subjectifs (rapportés). Signes = objectivables (observés/mesurés)." },
    { td:"TD2", front:"Sémiologie : définition", back:"Étude/repérage des symptômes et signes des troubles mentaux." },
    { td:"TD2", front:"Nosographie : définition", back:"Classification des troubles à partir de tableaux cliniques (configurations signes/symptômes)." },
    { td:"TD2", front:"Comorbidité : définition", back:"Association fréquente de deux troubles chez une même personne, sans causalité établie." },
    { td:"TD2", front:"Dans une vignette anxio-dépressive, priorité clinique ?", back:"Évaluer le risque suicidaire (idées, plan, moyens, facteurs de protection) + retentissement." },

    // TD3
    { td:"TD3", front:"Objectifs du 1er entretien (TD3)", back:"Histoire de la pathologie, antécédents, plainte, co-construire la demande, alliance, décider d’investigations." },
    { td:"TD3", front:"Étapes de l’anamnèse (TD3)", back:"1) Socio-démo 2) Problèmes actuels (subjectif) 3) Histoire de vie 4) Antécédents 5) Objectif/médical." },
    { td:"TD3", front:"Question ouverte inductive : exemple", back:"« Qu’est-ce qui était le plus difficile pour vous dans cette situation ? »" },

    // TD4
    { td:"TD4", front:"Psychoéducation : définition", back:"Informer patient/proches sur le trouble + développer des capacités pour y faire face." },
    { td:"TD4", front:"Annonce diagnostique : 3 verbes clés", back:"Expliquer – Écouter – Accompagner." },
    { td:"TD4", front:"Annonce diag : à éviter absolument", back:"Brutalité (couloir/téléphone), jargon non expliqué, banaliser/mentir/éviter, annonce trop précoce." },

    // TD5
    { td:"TD5", front:"TND : définition", back:"Affections débutant durant le développement, avec retentissement significatif (social/scolaire/pro)." },
    { td:"TD5", front:"6 catégories de TND (TD5)", back:"Handicap intellectuel, troubles de communication, TSA, TDAH, troubles apprentissages, troubles moteurs." },
    { td:"TD5", front:"Pourquoi pas d’annonce diagnostique au 1er entretien (cas type Thomas) ?", back:"Trop peu d’éléments : besoin d’entretiens + évaluations complémentaires (multi-contextes, échelles/tests) avant d’annoncer." }
  ],

  mcq: [
    { td:"TD1", q:"Dans le modèle biopsychosocial, un trouble est :", options:[
      "Expliqué uniquement par des facteurs biologiques",
      "Le résultat d’interactions entre facteurs biologiques, psychologiques et sociaux",
      "Toujours causé par un seul événement",
      "Sans lien avec le social"
    ], answer:1, explanation:"Le BPS pose une pathogenèse multifactorielle et interactionnelle." },

    { td:"TD2", q:"Un « signe » correspond plutôt à :", options:[
      "Une plainte subjective du patient",
      "Une observation mesurable par le professionnel",
      "Une hypothèse diagnostique",
      "Un facteur social"
    ], answer:1, explanation:"Signe = objectivable/observé ; symptôme = subjectif." },

    { td:"TD2", q:"La comorbidité, c’est :", options:[
      "Une complication causale d’un trouble",
      "L’association fréquente de deux troubles sans causalité établie",
      "Un diagnostic unique avec plusieurs symptômes",
      "Une absence de diagnostic"
    ], answer:1, explanation:"Comorbidité = coexistence fréquente, sans causalité prouvée." },

    { td:"TD3", q:"La co-construction de la demande signifie :", options:[
      "Imposer un diagnostic dès le 1er entretien",
      "Construire avec le patient ce qu’il attend et ce qui motive la consultation",
      "Éviter de parler des symptômes",
      "Ne poser que des questions fermées"
    ], answer:1, explanation:"On construit la demande avec le patient (motif, attentes, objectifs)." },

    { td:"TD4", q:"La psychoéducation vise principalement à :", options:[
      "Convaincre le patient qu’il n’a rien",
      "Informer et développer des capacités d’adaptation",
      "Remplacer tout suivi thérapeutique",
      "Se limiter à donner une brochure"
    ], answer:1, explanation:"Didactique + thérapeutique : comprendre et faire face." },

    { td:"TD5", q:"Un TND se caractérise par :", options:[
      "Un début exclusivement à l’âge adulte",
      "Un début pendant le développement avec retentissement fonctionnel",
      "Aucun retentissement scolaire",
      "Une cause toujours unique"
    ], answer:1, explanation:"Début développemental + retentissement social/scolaire/pro." }
  ],

  vignettes: [
    {
      td:"TD2",
      title:"Vignette – repérage signes/symptômes et hypothèse",
      case:"Une étudiante de 19 ans consulte : depuis 2 mois, elle se sent « vide », pleure souvent, dort mal, a perdu l’appétit et dit ne plus prendre de plaisir à ses loisirs. Elle se décrit « nulle » et s’isole. En cours, elle a du mal à se concentrer. Elle rapporte aussi une inquiétude quasi constante concernant ses résultats et une tension musculaire.",
      questions:[
        { q:"Liste 5 symptômes (subjectifs) et 2 signes (observables) possibles à rechercher/observer.", answer:"Symptômes (ex) : vide/tristesse, anhédonie, insomnie, perte d’appétit, dévalorisation, inquiétude, tension. Signes (ex) : ralentissement/agitation, perte de poids observable, évitement, fatigue visible." },
        { q:"Propose 1–2 hypothèses diagnostiques et justifie en 3 arguments.", answer:"Hypothèses : épisode dépressif caractérisé ± anxiété (TAG). Arguments : humeur dépressive/anhédonie + troubles somatiques (sommeil/appétit) + dévalorisation/concentration ; inquiétude + tension musculaire." },
        { q:"Quel élément est prioritaire à évaluer en sécurité ?", answer:"Risque suicidaire (idées, plan, moyens, facteurs de protection)." }
      ]
    },
    {
      td:"TD4",
      title:"Vignette – annonce diagnostique",
      case:"Marine, 22 ans, est hospitalisée après une tentative de suicide. Une évaluation évoque un trouble bipolaire. Tu dois préparer l’annonce avec un clinicien.",
      questions:[
        { q:"Fais une checklist « Avant / Pendant / Après » (6 items minimum).", answer:"Avant : lieu confidentiel, temps, dossier, acteurs pertinents, supports, plan de soins. Pendant : mots simples, nommer, pauses, écouter/valider émotions, espoir réaliste, proposer aides. Après : vérifier compréhension, écrit, prochain RDV, ressources/associations, proches si pertinent." }
      ]
    },
    {
      td:"TD5",
      title:"Vignette – TND (type Thomas)",
      case:"Un enfant de 4 ans parle en phrases, mais a une intonation monotone, utilise peu de gestes, joue souvent seul et a des intérêts très spécifiques (métro, ascenseurs). Il répond à son prénom, regarde dans les yeux, et a un jeu symbolique présent. À l’école : difficultés en groupe et graphisme.",
      questions:[
        { q:"Quels éléments vont plutôt dans le sens d’un TSA et lesquels sont plutôt rassurants ?", answer:"TSA : intonation monotone, peu de gestes/expressions, isolement, attention conjointe incomplète, intérêts restreints. Rassurant : contact oculaire, réponse au prénom, imitation, jeu symbolique." },
        { q:"Pourquoi ne pas annoncer un diagnostic dès maintenant ? Que proposer ?", answer:"Trop peu d’éléments : besoin évaluations complémentaires (multi-contextes, échelles/tests), anamnèse bio-psycho-sociale, lien école/famille, suivi." }
      ]
    }
  ],

  open_questions: [
    { td:"TD1", prompt:"Explique le modèle biopsychosocial et discute une limite.", points:[
      "Définition (interaction bio/psycho/social)",
      "Exemple clinique",
      "Conséquences sur évaluation/prise en charge",
      "Limite (éclectisme) + nuance"
    ]},
    { td:"TD3", prompt:"Décris les étapes d’un entretien anamnestique et donne 2 exemples de questions par étape.", points:[
      "Socio-démo",
      "Motif + subjectif",
      "Histoire de la pathologie (début/déclencheurs/évolution)",
      "Histoire de vie",
      "Antécédents",
      "Objectif/médical + conclusion"
    ]},
    { td:"TD4", prompt:"Propose un protocole d’annonce diagnostique : avant, pendant, après.", points:[
      "Cadre (lieu, temps, acteurs)",
      "Mots simples, vérité sans brutalité",
      "Silences + écoute émotions",
      "Accompagnement + plan de soin",
      "Vérifier compréhension + ressources"
    ]},
    { td:"TD5", prompt:"Présente les troubles neurodéveloppementaux : définition + 6 catégories + 1 exemple.", points:[
      "Définition + retentissement",
      "Liste des 6 TND",
      "Exemple clinique + critères clés",
      "Comorbidités possibles",
      "Pourquoi évaluation multi-contextes"
    ]}
  ]
};
