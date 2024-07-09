package main

import (
	"github.com/kataras/iris"

	"github.com/kataras/iris/middleware/logger"
	"github.com/kataras/iris/middleware/recover"

	"github.com/iris-contrib/middleware/csrf"

	"encoding/base64"
	"fmt"
	"net/http"
	"path"
	"regexp"
	"time"

	"github.com/go-xorm/xorm"
	//"github.com/kataras/iris/sessions"
	_ "github.com/mattn/go-sqlite3"
)

/*
	XORM:
	go get -u github.com/mattn/go-sqlite3
	go get -u github.com/go-xorm/xorm
*/
type Post struct {
	ID        int64 // auto-increment by-default by xorm
	Ip        string
	Name      string
	Email     string
	Subject   string
	Message   string    `json:"content"`
	CreatedAt time.Time `xorm:"created"`
	UpdatedAt time.Time `xorm:"updated"`
}

var orm *xorm.Engine
var app *iris.Application

var isFile, _ = regexp.Compile("^[a-zA-Z0-9_.-]+\\.[a-zA-Z0-9_.-]+$")

/*
TODO: add session
var (
	cookieNameForSessionID = "_iris_csrf"
	sess                   = sessions.New(sessions.Config{Cookie: cookieNameForSessionID})
)
*/

func main() {
	var err error

	app = newApp()
	// XORM
	orm, err = xorm.NewEngine("sqlite3", "./sqlite3.db")
	if err != nil {
		app.Logger().Fatalf("orm failed to initialized: %v", err)
	}

	iris.RegisterOnInterrupt(func() {
		orm.Close()
	})

	err = orm.Sync2(new(Post))

	if err != nil {
		app.Logger().Fatalf("orm failed to initialized Post table: %v", err)
	}

	// Because of nginx, need X-Forwarded-For, or IP will be localhost
	app.Run(
		iris.Addr(":2128"),
		iris.WithoutServerError(iris.ErrServerClosed),
		iris.WithRemoteAddrHeader("X-Forwarded-For"),
	)
}
func newApp() *iris.Application {
	// Setup IRIS
	app := iris.New()

	app.Logger().SetLevel("debug")
	app.Use(recover.New())
	app.Use(logger.New())

	// CSRF
	protect := csrf.Protect([]byte("9AB0F421E53A477C084477AEA06096F5"),
		csrf.Secure(false),
		csrf.HTTPOnly(false),
		csrf.RequestHeader("X-Csrf-Token"),
		//csrf.CookieName("csrftoken"),
	)

	// Setup SPA
	app.RegisterView(iris.HTML("./dist", ".html"))

	// token to header on every request except files,
	// before the spa ofc.
	app.Use(protect, func(ctx iris.Context) {
		if ctx.Method() != iris.MethodGet {
			ctx.Next()
			return
		}

		p := ctx.Path()

		isNotFile := len(p) <= 1 || !isFile.MatchString(path.Base(p))
		if isNotFile {
			// get the generate token by "csrf - protect middleware
			// and saved to the request-scoped context's values.
			tok := csrf.Token(ctx)
			// You don't need those, but good to know:
			// ctx.Header("X-CSRF-Token", tok)
			// ctx.Header("Access-Control-Allow-Origin", "*")
			// ctx.Header("Access-Control-Allow-Headers", "*")
			// ctx.Header("Access-Control-Expose-Headers", "*")
			// ctx.Header("Access-Control-Allow-Credentials", "true")

			//ctx.ViewData("csrf", tok)
			// if don't need other template fields
			// use ctx.View("index.html", tok)
			// and change {{.csrf}} to {{.}} in index.html
			//ctx.View("index.html")
			if p == "/projects/p2ptransfer" {
				ctx.View("assets/projects/p2ptransfer.html", tok)
				return
			}
			if p == "/en/projects/p2ptransfer" {
				ctx.View("assets/projects/en_p2ptransfer.html", tok)
				return
			}

			if p == "/projects/iot_admin" {
				ctx.View("assets/projects/iot_admin.html", tok)
				return
			}
			if p == "/en/projects/iot_admin" {
				ctx.View("assets/projects/en_iot_admin.html", tok)
				return
			}

			if p == "/projects/rehabilitation" {
				ctx.View("assets/projects/rehabilitation.html", tok)
				return
			}
			if p == "/en/projects/rehabilitation" {
				ctx.View("assets/projects/en_rehabilitation.html", tok)
				return
			}

			if p == "/projects/p2ptransfer/smile" {
				// s := sess.Start(ctx)
				// logined, _ := s.GetBoolean("login")
				//if !logined {
				ctx.View("assets/projects/p2ptransferfool.html", tok)
				return
				//}
			}
			ctx.View("index.html", tok)
			return
		}

		ctx.Next()
	})

	assetHandler := app.StaticHandler("./dist", false, false)
	app.SPA(assetHandler)

	app.PartyFunc("/api", func(apiRouter iris.Party) {
		apiRouter.Post("/message", postMessageForm)
	})

	return app
}

func postMessageForm(ctx iris.Context) {
	p := &Post{}
	if err := ctx.ReadJSON(p); err != nil {
		ctx.StatusCode(iris.StatusBadRequest)
		ctx.WriteString(err.Error())
		return
	}

	p.Ip = ctx.RemoteAddr()
	app.Logger().Debugf("%#v", p)

	orm.Insert(p)

	go lineBot(p)

	ctx.JSON(iris.Map{"success": true})
}

func lineBot(p *Post) {
	msg := fmt.Sprintf(
		"name: %s\nemail: %s\nsubject: %s\nmsg: %s\nip: %s\ntime: %s",
		p.Name, p.Email, p.Subject, p.Message, p.Ip, p.CreatedAt,
	)
	encode := base64.StdEncoding.EncodeToString([]byte(msg))

	lineURL := fmt.Sprintf(
		"https://douasin.com/echobot/msgpusher/hsuan_cv/%s/", encode,
	)
	http.Get(lineURL)
}
