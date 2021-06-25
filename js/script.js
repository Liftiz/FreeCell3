
var Game = function() {
    // les emplacements vides pour déplacer les cartes
    this.free = [null, null, null, null];
    // les espaces pour contenir les combinaisons complétées
    this.suits = [null, null, null, null];
    // les colonnes de cartes
    this.columns = [[], [], [], [], [], [], [], []];
    // le jeu de cartes
    this.deck = new this.Deck();
};

/**
 * Initialise l'objet de jeu.
 */
Game.prototype.init = function() {
    var card;

    // mélanger le jeu
    this.deck.shuffle();

    for (var i = 0; i < 52; i++) {
        // ajouter les cartes aux colonnes
        card = this.deck.cards[i];
        this.columns[i % 8].push(card);
    }
};

/**
 * Remise à zéro du jeu
 */
Game.prototype.reset = function() {
    var i, col;

    this.free = [null, null, null, null];
    this.suits = [null, null, null, null];

    for (i = 0; i < 8; i++) {
        col = this.columns[i];
        col.length = 0;
    }

    this.init();
};

/**
 * Crée un tableau d'identifiants des cartes valides pouvant être glissées.
 */
Game.prototype.valid_drag_ids = function() {
    var drag_ids, i, card, col, col_len;

    drag_ids = [];

    //  ajouter des cartes dans les espaces freecell
    for (i = 0; i < 4; i++) {
        card = this.free[i];
        if (card !== null) {
            drag_ids.push(card.id.toString());
        }
    }
    // ajouter des cartes en bas des colonnes
    for (i = 0; i < 8; i++) {
        col = this.columns[i];
        col_len = col.length;
        if (col_len > 0) {
            card = col[col_len - 1];
            drag_ids.push(card.id.toString());
        }
    }

    return drag_ids;
};

/**
 * Créez un tableau d'emplacements de dépôt valides pour la carte. Les ids sont la chaîne de l'attribut id dans le DOM.
 */
Game.prototype.valid_drop_ids = function(card_id) {
    var drop_ids, i, free, suit_card, drag_card, bottom_cards, card, col;

    drop_ids = [];

    // la carte que l'on fait glisser
    drag_card = this.deck.get_card(card_id);

    // ajouter des cellules vides
    for (i = 0; i < 4; i++) {
        free = this.free[i];
        if (free === null) {
            drop_ids.push('free' + i.toString());
        }
    }

    // ajouter une cellule de combinaison valide (le cas échéant)
    for (i = 0; i < 4; i++) {
        suit_card = this.suits[i];
        if (suit_card === null) {
            // si la carte que l'on glisse est un as, alors c'est une suite valide.
            if (drag_card.value === 1) {
                drop_ids.push('suit' + i.toString());
            }
        } else {
            // est la carte glissée la plus proche dans la séquence de couleurs 
            // dans la cellule de la combinaison - puis la suite valide
            if ((drag_card.suit === suit_card.suit) &&
                (drag_card.value === suit_card.value + 1)) {
                drop_ids.push('suit' + i.toString());
            }
        }
    }

    // ajouter une carte valide en bas d'une colonne
    bottom_cards = this.col_bottom_cards();
    for (i = 0; i < bottom_cards.length; i++) {
        card = bottom_cards[i];

        if ((card.value === drag_card.value + 1) &&
            (card.colour !== drag_card.colour)) {
            drop_ids.push(card.id.toString());
        }
    }

    // ajouter une colonne vide comme emplacement de dépôt valide
    for (i = 0; i < 8; i++) {
        col = this.columns[i];
        if (col.length === 0) {
            drop_ids.push('col' + i.toString());
        }
    }

    return drop_ids;
};

/*
 * Retourne un tableau des cartes qui se trouvent en bas des colonnes.
 */
Game.prototype.col_bottom_cards = function() {
    var i, col, card_count, bottom_cards;

    bottom_cards = [];

    for (i = 0; i < 8; i++) {
        col = this.columns[i];
        card_count = col.length;
        if (card_count > 0) {
            bottom_cards.push(col[card_count - 1]);
        }
    }

    return bottom_cards;
};

/**
* Déplacer une carte vers un nouvel emplacement
 * drag_id est un nombre entier
 * drop_id est une chaîne de caractères
 */
Game.prototype.move_card = function(drag_id, drop_id) {
    var drag_card, col_index;

    // faire sortir la carte de son emplacement actuel
    drag_card = this.pop_card(drag_id);

    if (drop_id.length <= 2) {
        // déposer cette carte sur une autre carte en colonne
        drop_id = parseInt(drop_id, 10);
        this.push_card(drag_card, drop_id);
    } else {
        // tomber sur une cellule libre ou une cellule de combinaison ou une colonne vide
        // l'indice de
        col_index = parseInt(drop_id.charAt(drop_id.length - 1), 10);
        if (drop_id.slice(0, 1) === 'f') {
      
            this.free[col_index] = drag_card;
        } else if (drop_id.slice(0, 1) === 's') {
           
            this.suits[col_index] = drag_card;
        } else {
            // dropping on an empty column
            this.columns[col_index].push(drag_card);
        }
    }
};

/**
 * Retourne l'objet carte et le retire de son emplacement actuel.
 * card_id est un nombre entier.
 */
Game.prototype.pop_card = function(card_id) {
    var i, col, card;

    // vérifiez le bas de chaque colonne
    for (i = 0; i < 8; i++) {
        col = this.columns[i];
        if (col.length === 0) {
            continue;
        }
        card = col[col.length - 1];
        if (card.id === card_id) {
            return col.pop();
        }
    }

    // vérifier les cellules libres
    for (i = 0; i < 4; i++) {
        card = this.free[i];
        if ((card !== null) && (card.id === card_id)) {
            this.free[i] = null;
            return card;
        }
    }
    // ne devrait pas atteindre ce point - devrait toujours trouver la carte
    alert('error in Game.pop_card()');
    return null;
};

/**
 * Pousser la carte au bout d'une colonne en fonction de l'identifiant de la carte du bas.
 */
Game.prototype.push_card = function(card, drop_id) {
    var i, col, col_len, bottom_card;

    for (i = 0; i < 8; i++) {
        col = this.columns[i];
        col_len = col.length;
        if (col_len === 0) {
            continue;
        }
        bottom_card = col[col.length - 1];
        if (bottom_card.id === drop_id) {
            col.push(card);
            return;
        }
    }
};

/**
 * Le match a-t-il été gagné ?
 */
Game.prototype.is_game_won = function() {
    var i, card;

    for (i = 0; i < 4; i++) {
        card = this.suits[i];
        if (card === null || card.value !== 13) {
            return false;
        }
    }
    return true;
};

/******************************************************************************/

/**
 *Objet Deck - contient un tableau de cartes.
 */
Game.prototype.Deck = function() {
    var suits, values, colours, i, suit, value;

    suits = ['clubs', 'spades', 'hearts', 'diamonds'];
    values = [1, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
    colours = {'clubs': 'black',
               'spades': 'black',
               'hearts': 'red',
               'diamonds': 'red'};

    this.cards = [];
    for (i = 0; i < 52; i++) {
        suit = suits[i % 4];
        value = values[Math.floor(i / 4)];
        this.cards.push(new this.Card(i + 1, suit, value, colours[suit]));
    }
};

/**
 * mélange le jeu de cartes
 */
Game.prototype.Deck.prototype.shuffle = function() {
    var len, i, j, item_j;


    len = this.cards.length;
    for (i = 0; i < len; i++) {
        j = Math.floor(len * Math.random());
        item_j = this.cards[j];
        this.cards[j] = this.cards[i];
        this.cards[i] = item_j;
    }
};

/**
 * Obtenir la carte par son identifiant
 */
Game.prototype.Deck.prototype.get_card = function(card_id) {
    var i, card;

    for (i = 0; i < 52; i++) {
        card = this.cards[i];
        if (card_id === card.id) {
            return card;
        }
    }
    // ne s'affiche que si le numéro de carte fourni est invalide.
    alert('error in Deck.get_card()');
    return null;
};

/******************************************************************************/

/**
 * L'objet de la carte
 */
Game.prototype.Deck.prototype.Card = function(id, suit, value, colour) {
    this.id = id;
    this.suit = suit;
    this.value = value;
    this.colour = colour;
};

/**
 * Cette carte et une autre carte ont-elles la même suite ?
 */
Game.prototype.Deck.prototype.Card.prototype.sameSuit = function(other) {
    return this.suit === other.suit;
};

/**
 * cette carte et une autre carte ont-elles la même couleur ?
 */
Game.prototype.Deck.prototype.Card.prototype.sameColour = function(other) {
    return this.colour === other.colour;
};

/**
 *  cette carte et une autre carte ont-elles la même valeur ?
 */
Game.prototype.Deck.prototype.Card.prototype.sameValue = function(other) {
    return this.value === other.value;
};

/**
 * Le nom et l'emplacement de l'image sous forme de chaîne. Utilisé lors de la création de la page web.
 */
Game.prototype.Deck.prototype.Card.prototype.image = function() {
    return 'images/' + this.id.toString() + '.png';
};

/******************************************************************************/

/**
 * L'interface utilisateur
 */
var UI = function(game) {
    this.game = game;
    // un tableau de tous les draggables
    this.drag = [];
    // un tableau de tous les droppables
    this.drop = [];
};

/**
 * Initialiser l'interface utilisateur
 */
UI.prototype.init = function() {
    this.game.init();

    this.add_cards();

    // configurer le dialogue de victoire
    this.win();
    // configurer le bouton de nouveau jeu
    this.new_game();
    // configurer le dialogue et le bouton d'aide
    this.help();

    this.setup_secret();

    // initialise les draggables
    this.create_draggables();
};

/**
 * Ajouter des cartes à l'interface utilisateur
 */
UI.prototype.add_cards = function() {
    var i, j, cards, num_cards, col_div, card, img, card_div;

    for (i = 0; i < 8; i++) {
        cards = this.game.columns[i];
        num_cards = cards.length;

        // obtenir une référence à la colonne div
        col_div = document.getElementById('col' + i.toString());

        for (j = 0; j < num_cards; j++) {
            // ajouter des divs de carte à la div de colonne
            card = cards[j];
            img = new Image();
            img.src = card.image();

            card_div = document.createElement('div');
            card_div.className = 'card';
            card_div.id = card.id;
            card_div.style.top = (25 * j).toString() + 'px';
            card_div.appendChild(img);

            col_div.appendChild(card_div);
        }
    }
};

/**
 * Retirer les cartes de l'interface utilisateur
 */
UI.prototype.remove_cards = function() {
    var i;

    for (i = 0; i < 8; i++)
    {
        $('#col' + i.toString()).empty();
    }
};

/**
 * Créer des draggables : les cartes dans les freecells et en bas de toutes les colonnes peuvent être glissées.
 * colonnes peuvent être glissées.
 */
UI.prototype.create_draggables = function() {
    var card_ids, card_count, i, id, card_div, this_ui;

    card_ids = this.game.valid_drag_ids();
    card_count = card_ids.length;
    this_ui = this;

    for (i = 0; i < card_count; i++) {
        id = card_ids[i];
        card_div = $('#' + id);

        // ajouter à la liste des  draggables
        this_ui.drag.push(card_div);

        card_div.draggable({
            stack: '.card',
            containment: '#table',
            revert: 'invalid',
            revertDuration: 200,
            start: this_ui.create_droppables(),
            stop: this_ui.clear_drag()
        });
        card_div.draggable('enable');

        // ajout de la gestion de l'événement double-clic à tous les draggables
        card_div.bind('dblclick', {this_ui: this_ui}, this_ui.dblclick_draggable);

        card_div.hover(
            // début du survol
            function(event) {
                $(this).addClass('highlight');
            },
            // Fin du survol
            function(event) {
                $(this).removeClass('highlight');
            }
        );
    }
};

/**
 * Lorsqu'une carte glissante se trouve en bas d'une colonne et qu'elle est double-cliquée,
 * vérifiez si elle peut être déplacée vers une colonne de fondation ou un freecell vide. Si c'est le cas,
 * alors déplacez-la.
 */
UI.prototype.dblclick_draggable = function(event) {
    var this_ui, drop_ids, card_id, drop_len, i, drop_id, drop_div;
    this_ui = event.data.this_ui;

    // les lieux de dépôt valides pour cette carte
    card_id = parseInt(this.id, 10);
    drop_ids = this_ui.game.valid_drop_ids(card_id);
    drop_len = drop_ids.length;

    // la carte peut-elle être déplacée vers une cellule de couleur
    for (i = 0; i < drop_len; i++) {
        drop_id = drop_ids[i];
        if (drop_id.substr(0, 4) === 'suit') {
            this_ui.dblclick_move(card_id, drop_id, this_ui);
            return;
        }
    }

    // la carte peut-elle être déplacée vers un freecell vide 
    for (i = 0; i < drop_len; i++) {
        drop_id = drop_ids[i];
        if (drop_id.substr(0, 4) === 'free') {
            this_ui.dblclick_move(card_id, drop_id, this_ui);
            return;
        }
    }
};

UI.prototype.dblclick_move = function(card_id, drop_id, this_ui) {
    var offset_end, offset_current, drop_div, left_end, top_end, left_move,
        top_move, card, left_current, top_current, max_z;

    card = $('#' + card_id);
    drop_div = $('#' + drop_id);
    offset_end = drop_div.offset();
    offset_current = card.offset();

    left_end = offset_end['left'];
    top_end = offset_end['top'];
    left_current = offset_current['left'];
    top_current = offset_current['top'];

    // ajouter 3 pour la bordure
    left_move = left_end - left_current + 3;
    top_move = top_end - top_current + 3;

    // Avant de déplacer la carte, empilez-la sur toutes les autres cartes.
    max_z = this_ui.card_max_zindex();
    card.css('z-index', max_z + 1);

    card.animate({top: '+=' + top_move, left: '+=' + left_move},
                  250,
                  function() {
                        // dire au jeu que la carte a été déplacée
                        this_ui.game.move_card(card_id, drop_id);
                        this_ui.clear_drag()();
                        this_ui.is_won();

    });
};

UI.prototype.card_max_zindex = function() {
    var max_z = 0;
    $('.card').each(function(i, el) {
        z_index = parseInt($(el).css('z-index'), 10);
        if (!isNaN(z_index) && z_index > max_z) {
            max_z = z_index;
        }
    });
    return max_z;
};

/**
 * Créer des éléments à déposer : lorsqu'une carte est glissée, décider où elle peut être déposée.
 * Cette méthode doit être appelée lorsqu'une carte est glissée.
 *
 * Cette méthode devrait utiliser des méthodes de jeu pour prendre des décisions.
 *
 * Utilisez cette méthode comme callback pour l'événement de démarrage du drag. C'est pourquoi elle a
 * les deux paramètres (event, ui).
 */
UI.prototype.create_droppables = function() {
    var this_ui;
    this_ui = this;

    var droppers = function(event, ui) {
        var drop_ids, i, drop_id, drag_id, drop_div;

        drag_id = parseInt($(this).attr('id'), 10);
        drop_ids = this_ui.game.valid_drop_ids(drag_id);

        for (i = 0; i < drop_ids.length; i++) {
            drop_id = drop_ids[i];
            drop_div = $('#' + drop_id.toString());
            // ajouter au tableau de droppables
            this_ui.drop.push(drop_div);
            drop_div.droppable({
                // rappel pour l'événement de chute
                drop: function(event, ui) {
                    var card_offset, this_id;

                    this_id = $(this).attr('id');
                    if (this_id.length <= 2) {
                        // c'est une carte
                        card_offset = '0 25';
                    } else if (this_id.charAt(0) === 'c') {
                        // cette colonne est vide
                        card_offset = '1 1';
                    } else {
                        // c'est une cellule libre ou une cellule de combinaison
                        card_offset = '3 3';
                    }

                    // déplacer le droppable à la bonne position
                    ui.draggable.position({
                        of: $(this),
                        my: 'left top',
                        at: 'left top',
                        offset: card_offset
                    });

                    // indiquer au jeu que la carte a été déplacée
                    this_ui.game.move_card(drag_id, this_id);

                    // le jeu est-il terminé ?
                    this_ui.is_won();

                    // réinitialisation de l'interface utilisateur pour qu'il n'y ait pas d'objets tombants
                    this_ui.clear_drop();
                }
            });
            drop_div.droppable('enable');
        }
    };

    return droppers;
};

/*
 * Effacer tous les éléments du drag
 */
UI.prototype.clear_drag = function() {
    var this_ui;
    this_ui = this;

    return function(event, ui) {
        var i, item;

        for (i = 0; i < this_ui.drag.length; i++) {
            item = this_ui.drag[i];
            // supprimer les classes de survol
            item.unbind('mouseenter').unbind('mouseleave');
            // forcer le retrait de la surbrillance des cartes qui sont tombées sur les
            // cellules de couleur
            $(this).removeClass('highlight');
            // supprimer le gestionnaire de double-clic
            item.unbind('dblclick');
            item.draggable('destroy');
        }
        // vider le tableau des draggables
        this_ui.drag.length = 0;

        // vider le tableau des objets à déposer - ceci assure que le tableau des objets à déposer est
        // effacé après un dépôt invalide
        this_ui.clear_drop();

        // créer de nouveaux draggables
        this_ui.create_draggables();
    };
};

/**
 * Effacer tous les objets à déposer
 */
UI.prototype.clear_drop = function() {
    var i, item;

    for (i = 0; i < this.drop.length; i++) {
        item = this.drop[i];
        item.droppable('destroy');
    }
    // vider le tableau de drop
    this.drop.length = 0;
};

UI.prototype.is_won = function() {
    if (this.game.is_game_won()) {
        this.win_animation();
        $('#windialog').dialog('open');
    }
};

/**
 * Animer les cartes à la fin d'une partie gagnée
 */
UI.prototype.win_animation = function() {
    var i, $card_div, this_ui, v_x;

    for (i = 0; i < 53; i++) {
        $card_div = $('#' + ((i + 4)%52 + 1));
        this_ui = this;
        v_x = 3 + 3*Math.random();

        // ceci est nécessaire pour IE car vous ne pouvez pas passer de paramètres à la fonction
        // à la fonction setTimeout. Il faut donc créer une fermeture pour lier
        // les variables.
        function animator($card_div, v_x, this_ui) {
            setTimeout(function() {
                this_ui.card_animation($card_div, v_x, 0, this_ui);
            }, 250*i);
        }
        animator($card_div, v_x, this_ui);
    }
};

/**
 * Animation d'une seule carte
 */
UI.prototype.card_animation = function($card_div, v_x, v_y, this_ui) {
    var pos, top, left, bottom;

    pos = $card_div.offset();
    top = pos.top;
    left = pos.left;

       // calculer la nouvelle vitesse verticale v_y
    bottom = $(window).height() - 96; // 96 est la hauteur de la carte div
    v_y += 0.5; // acceleration
    if (top + v_y + 3 > bottom) {
        // rebondir la carte en bas, et ajouter de la friction
        v_y = -0.75*v_y; // friction = 0.75
    }

    left -= v_x;
    top += v_y;
    $card_div.offset({top: top, left: left});
    if (left > -80) {
        // poursuivre l'animation uniquement si la carte est encore visible
        setTimeout(function() {
            var cd = $card_div;
            this_ui.card_animation(cd, v_x, v_y, this_ui);
        }, 20);
    }
};

UI.prototype.setup_secret = function() {
    var this_ui = this;
    $('#secret').click(function() {
        this_ui.win_animation();
    });
};

/**
 * Afficher la boîte de dialogue de la victoire
 */
UI.prototype.win = function() {
    $('#windialog').dialog({
        title: 'Freecell',
        modal: true,
        show: 'blind',
        autoOpen: false,
        zIndex: 5000
    });
};

/**
 * Afficher la boîte de dialogue help
 */
UI.prototype.help = function() {
    $('#helptext').dialog({
        title: 'Help',
        modal: true,
        show: 'blind',
        autoOpen: false,
        zIndex: 5000,
        minWidth: 550
    });

    $('#help').click(function() {
        $('#helptext').dialog('open');
    });

};

UI.prototype.new_game = function() {
    var this_ui = this;
    $('#newgame').click(function() {
        this_ui.game.reset();
        this_ui.remove_cards();
        this_ui.add_cards();
        this_ui.create_draggables();

    });
};

/******************************************************************************/

var my_ui;
$(document).ready(function() {
    var g;
    g = new Game();
    my_ui = new UI(g);
    my_ui.init();
});

