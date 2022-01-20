interface IStrings {
    [name: string]: {fr: string, en: string}
}

const Strings: IStrings = {
    LOGOUT: {
        fr: "Déconnexion",
        en: "Logout"
    }
}

const locale = 'fr';

for(const id in Strings) {
    //@ts-ignore
    Strings[id] = Strings[id][locale];
}

export default Strings;