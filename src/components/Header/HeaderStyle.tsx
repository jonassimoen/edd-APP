import { mediaQueries } from "@/styles/media-queries";
import styled, { keyframes } from "@/styles/styled-components";
import { theme } from "@/styles/theme";
import headerBg from "../../assets/img/new_pattern.png";

const slideIn = keyframes`
	0% { opacity: 0; top: -5px; }
	30% { opacity: 1; top: -5px; }
	100% { opacity: 1; top:  0px; } 
`;

export const HeaderStyle = styled.header`
    &.has-open-nav {
        height: 100vh;
        overflow: hidden;
        
        > .c-nav-mobile {
            clip-path: inset(0 0 0 0);
            pointer-events: auto;
        }

        & .c-nav-mobile__list {
            opacity: 1;
            transform: translateY(0);
        }
    
        & .c-nav-trigger__top {
            -webkit-transform: translateY(8px) rotate(135deg);
            transform: translateY(8px) rotate(135deg);
        }
        
        & .c-nav-trigger__middle {
            opacity: 0;
        }
    
        & .c-nav-trigger__bottom {
            -webkit-transform: translateY(-8px) rotate(-135deg);
            transform: translateY(-8px) rotate(-135deg);
        }
    }
    & .c-header {    
        position: sticky;
        top: 0;
        z-index: 4;
        background-color: ${theme.primaryContrast};
        background-image: url(${headerBg});
        background-position: center top;
        border-bottom: 5px solid ${theme.primaryContrast};
        background-repeat: no-repeat;

        &__nav {
            @media ${mediaQueries.mobileS} {
                padding: 0 1.5rem;
            }
            
            @media ${mediaQueries.laptop} {
                padding: 0 2rem;
            }

            &-inner {
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 5rem;
                
                .c-logo {
                    display: inline-block;
                    width: 12rem;
                    height: 4.5rem;
                    margin: auto;
                    background-repeat: no-repeat;
                    background-position: 50%;
                    background-size: contain;
                    text-indent: -99999px;
                    cursor: pointer;
                }

                .c-nav-main {
                    display: none;
                    @media ${mediaQueries.laptop} {
                        display: block
                    }
        
                    > ul {
                        list-style: none;
                        display: flex;
                        margin: 0;
        
                        > li {
                            margin-left: 2rem;
                            font-size: .875rem;
                        
        
                            > a {
                                display: block;
                                border-top: 3px solid transparent;
                                border-bottom: 3px solid transparent;
                                text-decoration: none;
                                font-weight: 500;
                                -webkit-transition: border-color .2s, color .2s;
                                transition: border-color .2s, color .2s;
                                text-decoration: none;
                                color: #c9c5ce;
        
                                &:hover {
                                    color: ${theme.secondaryColor};
                                }
                            }
                        }
                    }

                    &__item {
                        padding: 1.75rem 0;
                    }

                    &__link {
                        padding: 0.2rem 0.3rem;
                    }
                }
        
            }
        }
    
    }
    .o-list {
        list-style: none;
        padding-left: 0;
    }

    .c-row {
        position: relative;
        overflow: auto;        
        display: none;

        @media ${mediaQueries.tablet} {
            display: block;
            padding: 2rem 2rem 1rem;
        }
        
        &--alpha {
            background-color: #fff;
        }

        .ant-layout {
            display: flex;
            flex-direction: column;
            min-height: 0;
        }

        .o-list {
            list-style: none;
            padding-left: 0;
        }
    }

    .c-nav-tabs {
        display: flex;
        flex-direction: column;
        
        @media ${mediaQueries.tablet} {
            flex-direction: row;
            margin: 0;
        }

        &__item {
            padding: 0 0.75rem;

            &.is-selected .c-nav-tabs__link {
                color: ${theme.secondaryColor};
                border-color: ${theme.secondaryColor};
            }
            
        }

        &__link {
            display: block;
            padding: 0.5rem 0;
            text-decoration: none;
            font-weight: 500;
            border-bottom: 3px solid transparent;
            transition: border-color .2s, color .2s;
            color: #61566b;

            &:hover {
                color: ${theme.secondaryColor};
                border-color: ${theme.secondaryColor};
            }
        }
    }

    .c-nav-mobile {
        display: flex;
        
        @media (min-width: 64em) {
            display: none
        }
        flex-wrap: wrap;
        position: fixed;
        z-index: 3;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        padding: 6rem 1.5rem 4rem;
        background-color: ${theme.primaryContrast};
        -webkit-clip-path: inset(0 0 100% 0);
        clip-path: inset(0 0 100% 0);
        -webkit-transition: -webkit-clip-path .5s cubic-bezier(0, .5, 0, 1);
        transition: -webkit-clip-path .5s cubic-bezier(0, .5, 0, 1);
        transition: clip-path .5s cubic-bezier(0, .5, 0, 1);
        transition: clip-path .5s cubic-bezier(0, .5, 0, 1), -webkit-clip-path .5s cubic-bezier(0, .5, 0, 1);
        pointer-events: none;
        overflow: auto;
        ::-webkit-scrollbar {
            display: none;
          }
        &__main {
            flex-basis: 100%;
            padding-top: 1.5rem;
            @media ${mediaQueries.tablet} {
                flex-basis: 60%;
                padding: 4rem 2rem 0;
            }
        }

        &__list {
            .has-open-nav {
                opacity: 1;
            }
            opacity: 0;
            transform: translateY(-20px);
            transition: all .5s ease-out;
        }

        &__item {
            &.active {
                .c-nav-mobile__link {
                    color: ${theme.secondaryColor};
                }
            }
            text-align: left;
            font-size: 2rem;
            line-height: 1.6875em;
            padding-top: 1rem;
        }

        &__link {
            font-weight: 400;
            text-decoration: none;
            color: ${theme.colorLightGray};
        }
    }

    .is-selected.c-nav-main__item {
        border-bottom: 3px solid;
        border-bottom-color: ${theme.secondaryColor} !important;

        .c-nav-main__link {
            color: ${theme.secondaryColor};
            border-radius: 1rem;
            &:hover {
                color: ${theme.primaryContrast};
            }
        }
    }
` as any;



export const Hamburger = styled.button`
	background: none;
	appearance: none;
	border: 0;
	width: auto;
	color: white;
	text-align: left;
	margin-left: 5px;

	.anticon {
		margin-right: 10px;
	}

    .c-nav-trigger {
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
        display: block;
        outline: 0;
        
        &__top, &__middle, &__bottom {
            display: block;
            background-color: ${theme.primaryColor};
            -webkit-transform-origin: 50%;
            transform-origin: 50%;
            -webkit-transition: all .3s ease-in-out;
            transition: all .3s ease-in-out;
            margin: 6px 0;
            width: 24px;
            height: 2px;
        }
    }

	@media ${mediaQueries.laptop} {
		display: none;
	}
`;