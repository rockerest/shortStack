// ShortStack jQuery Plugin
(function( $ ){
    "use strict";
    var ss = {
        "init": function( options ){
            return this.each(function(){
                var $this       = $(this),
                    settings;

                if( $this.get( 0 ).tagName !== "TABLE" ){
                    throw new Error( "jquery.shortStack can only operate on TABLE elements: " + $this.get( 0 ).tagName + " given." );
                }

                settings = {
                    "start": 0,
                    "rows": 10,
                    "exclude": [],
                    "classes": {
                        "clearfix": "clear"
                    },
                    "control": {
                        "css": {
                            "width": "100%",
                            "borderBottom": "2px solid #999999",
                            "backgroundColor": "#EEEEEE",
                            "padding": "2px"
                        }
                    },
                    "buttons": {
                        "previous": {
                            "text": "<img alt=\"\" style=\"margin-bottom: -.25em\" src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAWxJREFUeNpi/P//PwMlgAVdQLPhNAMbBwcDKzs7GLOwsjKwsLDEAKVsgZalH0gSx28AFhDz58+fAlySTHi1/v8f8+f374IYLyljIM0AwsQbANT8+9evglgfOeMPH/4w/P75E4yJMuA/VHOcv4rxjRtfGL59w20AC1bNP38WpEQaGl+9+hEs9uMHE8OvHz+IiwWQ5vQ4C6Dmd0Cbv4Hx9+/sOA3A8MLvHz8mTJ65/yyvAAPDy/cfGD7//MXw9ddfhl/fv4MxQQOAXlgCdMWEFStPnBVSl2V4ySPI8IKVB+wCbK7AFYhLgIE4Yd+yfWfZZcQZHnMKMvwCBuAvYmLhySR3hvebqxl+P7+y5A/QkNvz1pz9ycmJMxYY0fMCIyMjnM0spsnApOEbwyiiDk6Jfw53m/x9dZ1gUga5ig+IeYGK2YH4ApNxynIGdn7jf69vSALFnxNyAcgJ7FDMDLUERIPEPwPVf8ZrAKkAIMAApwzLWZSw6eIAAAAASUVORK5CYII=\" />Previous Page"
                        },
                        "next": {
                            "text": "Next Page<img alt=\"\" style=\"margin-bottom: -.25em\" src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAXhJREFUeNpi/P//PwMlgAWZ4zDvJQMjI+NMIPPwnz9/lvz5/Zvh98+fYPzrxw+G6w2m+A34+/cviDKGYhBYQsgFTMgckI0gHOstZQykCxj+/48hyQCYc9+//8MQ7ydv/PvXL4KGYDXg+/c/DJcvf2KI9VMBG/IfjyEoBoACCoR///4HNOQHw/HjjxiCXIEu+fkTpyFYDXjz7gPD46dPgfQ7hsNH7zC428qCDSEYjb++fwfTr379Z/jAzg1m6ygJMqzddP4sMHonEDYAaDsIvGTlZnjJzcagK8nBsG3lfrBmVnb2JYS9AEowQPyClYdBXFqQ4diiHWeBgTgB6P8lP59cIpwSQTEAFmRnYbg+cwnE2e9uL/lyaS3D7+dXgDIlGAYwIucFVu0ABiYNvzMg9v83Nyf8u7F5yd9X1+Hy2PINigv+XNvIwSSgco3hx4dL/87NBVmpAcQ/oPg9EP/E6wKgk0EGCkEN/gcyEwn/AKr9g9cAcgBAgAEACsnYjGRDfAUAAAAASUVORK5CYII=\" />"
                        }
                    },
                    "sss": {
                        "rowsCount": 0
                    }
                };

                //extend data with options object
                settings = $.extend(settings, options);
                $this.data("shortStack", settings);

                $this.after( privacy.makeControlBar( $this ) );
                $this.shortStack( "refresh" );
                privacy.hideImpotentButtons( settings, $this );
            });
        },
        "nextPage": function(){
            return this.each(function(){
                var $this       = $(this),
                    settings    = $this.data( "shortStack" );

                settings.start = privacy.getNextIndex( settings );
                privacy.hideImpotentButtons( settings, $this );
                $this.shortStack( "refresh" );
            });
        },
        "previousPage": function(){
            return this.each(function(){
                var $this       = $(this),
                    settings    = $this.data( "shortStack" );

                settings.start = privacy.getPreviousIndex( settings );
                privacy.hideImpotentButtons( settings, $this );
                $this.shortStack( "refresh" );
            });
        },
        "refresh": function(){
            return this.each(function(){
                var $this       = $(this),
                    settings    = $this.data( "shortStack" ),
                    storage     = settings.sss,
                    prevCount   = storage.rowsCount;

                storage.rowsCount   = privacy.getRows( $this ).length;
                if( storage.rowsCount != prevCount ){
                    settings.start = 0;
                    privacy.hideImpotentButtons( settings, $this );
                }

                $this.shortStack( "import" );

                if( storage.rowsCount <= settings.rows ){
                    if( storage.rowsCount == 0 ){
                        privacy.toggleControlBar( $this, false );
                    }
                    else{
                        privacy.togglePaginationButtons( $this, false );
                    }
                }
                else{
                    privacy.toggleControlBar( $this, true );
                    privacy.togglePaginationButtons( $this, true );
                }

                if( settings.rows < storage.rowsCount ){
                    $( storage.rows ).each( function(i, row ){
                        if( i < settings.start || i >= (settings.start + settings.rows) ){
                            $(row).hide();
                        }
                        else{
                            $(row).show();
                        }
                    });
                }
            });
        },
        "import": function(){
            return this.each(function(){
                var $this       = $(this),
                    settings    = $this.data( "shortStack" ),
                    rows        = privacy.getRows( $this );

                settings.sss.rows   = rows;
            });
        },
        "destroy": function(){
            return this.each(function(){
                var $this   = $(this),
                    data    = $this.data( "shortStack" );

                ss.deployAll( privacy.getRows( $this ) );

                $(window).off(".shortStack");
                $this.removeData("shortStack");
            });
        },
        "debug": function(){
            return this.each(function(){
                var $this = $(this),
                data = $this.data("shortStack");

                console.log(data);
            });
        }
    };

    var privacy = {
        "getRows": function( obj ){
            var settings    = obj.data( "shortStack" ),
                rows        = obj.find( "tbody tr" );

            $( settings.exclude ).each( function( i, selector ){
                rows = rows.not( selector );
            });

            return rows;
        },
        "deployAll": function( rows ){
            console.log( "redeploying all rows" );
        },
        "makeControlBar": function( obj ){
            var controlBar  = $("<div></div>"),
                button      = $( "<button></button>" ),
                settings    = obj.data( "shortStack" );

            // get the controlBar
                controlBar
                    .css(settings.control.css)
                    .append( $("<div>")
                        .css({
                            "float": "left",
                            "textAlign": "left"
                        })
                        .append( $("<span>" )
                            .html( "Search: ")
                        )
                        .append( $("<input />")
                            .attr({
                                "type": "text"
                            })
                            .css({
                                "margin": "3px 0 -3px 2px"
                            })
                            .keyup( function(){
                                var $this       = $(this),
                                    filtered    = [],
                                    val         = $this.val(),
                                    split       = val.split( " " ),
                                    matchesAll,text;

                                if( val == "" ){
                                    obj.shortStack( "refresh" );
                                }
                                else{
                                    $(settings.sss.rows).each( function( i, row ){
                                        text = $(row).text();
                                        matchesAll = true;

                                        $(row).find("select,input").each( function( i, is ){
                                            text = text + ", " + $(is).val();
                                        });

                                        text = $.trim( text.replace( /\s*/g, "" ) ).toLowerCase();

                                        $( split ).each( function( i, string ){
                                            matchesAll = text.search( string.toLowerCase() ) > -1 ? matchesAll && true : matchesAll && false;
                                        });

                                        if( matchesAll ){
                                            filtered.push( row );
                                        }
                                    });

                                    $(settings.sss.rows).hide();
                                    $( filtered ).each( function( i, row ){
                                        $(row).show();
                                    });
                                }
                            })
                        )
                    )
                    .append( $("<div>")
                        .css({
                            "float": "right",
                            "textAlign": "left"
                        })
                        .append( button
                            .clone()
                            .html( settings.buttons.previous.text )
                            .click( function( e ){
                                var ss  = $( e.target ).closest( ".shortStack-controlBar" ).prev();
                                ss.shortStack( "previousPage" );
                                $(this).blur();
                                return false;
                            })
                        )
                        .append( button
                            .clone()
                            .html( settings.buttons.next.text )
                            .click( function( e ){
                                var ss  = $( e.target ).closest( ".shortStack-controlBar" ).prev();
                                ss.shortStack( "nextPage" );
                                $(this).blur();
                                return false;
                            })
                        )
                        .addClass( "shortStack-controlBar-paginationButtons" )
                    )
                    .addClass( settings.classes.clearfix )
                    .addClass( "shortStack-controlBar" );
            return controlBar;
        },
        "togglePaginationButtons": function( obj, state ){
            var btnContainer = obj.next( ".shortStack-controlBar" ).find( ".shortStack-controlBar-paginationButtons" );
            if( state ){
                btnContainer.fadeIn( 350 );
            }
            else{
                btnContainer.fadeOut( 350 );
            }
        },
        "toggleControlBar": function( obj, state ){
            var bar = obj.next( ".shortStack-controlBar" );
            if( state ){
                bar.fadeIn( 350 );
            }
            else{
                bar.fadeOut( 350 );
            }
        },
        "hideImpotentButtons": function( settings, obj ){
            var prevBtn = obj.next( ".shortStack-controlBar" ).find( ".shortStack-controlBar-paginationButtons button" ).first(),
                nextBtn = obj.next( ".shortStack-controlBar" ).find( ".shortStack-controlBar-paginationButtons button" ).last(),
                prev    = privacy.getPreviousIndex( settings ),
                next    = privacy.getNextIndex( settings ),
                present = settings.start;

            if( present == 0 ){
                if( present == prev ){
                    prevBtn.hide();
                }
                else{
                    prevBtn.show();
                }

                nextBtn.show();
            }
            else{
                if( present == next ){
                    nextBtn.hide();
                }
                else{
                    nextBtn.show();
                }

                prevBtn.show();
            }
        },
        "getNextIndex": function( settings ){
            return (settings.start + settings.rows > settings.sss.rowsCount) ? settings.start : settings.start + settings.rows;
        },
        "getPreviousIndex": function( settings ){
            return (settings.start - settings.rows) < 0 ? 0 : settings.start - settings.rows;;
        }
    };

    $.fn.shortStack = function( method ) {
        if ( ss[method] ){
            return ss[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        }
        else if ( typeof method === "object" || ! method ){
            return ss.init.apply( this, arguments );
        }
        else{
            $.error( "Method " + method + " does not exist on jQuery.shortStack" );
        }
    };
})( jQuery );
