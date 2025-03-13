package utils

import (
	"fmt"

	"github.com/go-playground/validator"
	"golang.org/x/crypto/bcrypt"
)

var Validator *validator.Validate

func HashPassword(password string) []byte {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		fmt.Printf("failed to hash password : %v\n", err)
		return nil
	}
	return hashedPassword
}

// required : Le champ est requis et ne peut pas être vide.
// omitempty : Le champ peut être vide.
// min=x : Le champ doit avoir une valeur numérique minimale x.
// max=x : Le champ doit avoir une valeur numérique maximale x.
// len=x : Le champ doit avoir une longueur exacte x (pour les chaînes, tranches, cartes, etc.).
// gte=x : Le champ doit être supérieur ou égal à x.
// gt=x : Le champ doit être strictement supérieur à x.
// lte=x : Le champ doit être inférieur ou égal à x.
// lt=x : Le champ doit être strictement inférieur à x.
// eq=x : Le champ doit être égal à x.
// ne=x : Le champ doit être différent de x.
// oneof=x,y,z : Le champ doit correspondre à l'une des valeurs x, y, ou z.
// email : Le champ doit être une adresse e-mail valide.
// url : Le champ doit être une URL valide.
// alpha : Le champ ne peut contenir que des caractères alphabétiques.
// alphanum : Le champ ne peut contenir que des caractères alphabétiques et numériques.
// numeric : Le champ doit être une valeur numérique valide (entier ou décimal).
// hexadecimal : Le champ doit être un nombre hexadécimal valide.
// hexcolor : Le champ doit être une couleur hexadécimale valide.
// iscolor : Le champ doit être une couleur CSS valide.
// isbn : Le champ doit être un numéro ISBN valide.
// uuid : Le champ doit être un UUID valide.
// ipv4 : Le champ doit être une adresse IPv4 valide.
// ipv6 : Le champ doit être une adresse IPv6 valide.
// cidr : Le champ doit être une notation CIDR valide.
// cidrv4 : Le champ doit être une notation CIDR IPv4 valide.
// cidrv6 : Le champ doit être une notation CIDR IPv6 valide.
// mac : Le champ doit être une adresse MAC valide.
