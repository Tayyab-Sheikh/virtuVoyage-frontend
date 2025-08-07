import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
} from "@mui/material";
import { motion } from "framer-motion";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
import ExploreIcon from "@mui/icons-material/Explore";

const sampleTours = [
  {
    id: 1,
    name: "Ancient Rome Walkthrough",
    place: "Rome, Italy",
    price: "$19.99",
    image:
      "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTExMWFhUXGRoaFxgYGBgaGhgaGRgXGBUYGhkYHSggGBomHRgYIjEhJSkrLi4uGB8zODMsNyktLisBCgoKDg0OGxAQGi8lHyUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIALcBEwMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAADBAIFBgABB//EAD4QAAECBAMFBgUDAgYBBQAAAAECEQADITEEEkEFUWFxgRMiMpGhsQZCwdHwFOHxFVIjYnKCkqIzFkNTstL/xAAZAQADAQEBAAAAAAAAAAAAAAABAgMABAX/xAAnEQACAgEFAAIBBAMAAAAAAAAAAQIREgMTITFBUWEiBBRCkTJxof/aAAwDAQACEQMRAD8Ax3aFmFBbpE5MomweLDBYLMdABd90Xuz1hKu4hJejtGnqKPQsNNy7KT+iT1MUod9xHOr2iy/oU8oGYsRQAV5BxGgSp6ldtBaBf1hlZQCYhvSfhdaMUZhODmy6TJauAve1otsPspYSFZSCeNhxeNDOxh7NyQ9Iqp8xa7Lyjd/EMm5+CtKHoSXtbIMpBJ1ZveEJuKUopRLckmhVoTztBzhGrmD79T0ESw2H7zxSMIpcEpTk3TLfY8wggqZ9W32YVra8VfxlsyUFJXLzBavEGoaCo3Re7PkoCsz0GmkWaFoJ8KC5eoB61iMZOMrLSipRo+YI2cshwkkb2j04BQukjpH1JOIT2gQJaSd7AARHassKBSBXlbrpF1+o56IP9Px2fLf0xiScPGwn7ObQDkQf3hRWz9wjoU0zmlFozww8SEiLhWCO6PBgzuhrQnJWJw8FRhos0YSGJeGaA2FWV0jZ7nvO2rXizwAGHWVBJynK7s9Ks+54mEmJCWSISXPZSLrovcPtmQaFCR/tALm8KbWw2EWorABLWBIegqSNYq0YMrUEpDqNh/MWuG+Flq8U1CKOwdVOJFB5xJwS9KqcpeGfm7Pl5e64I3kfaEsrRvcJ8JyinvzFrNQ6GCRxDgkt5QCd8EoBzdscgqQUgqbWop1aHU0K9OT8MMqBkR9H/oWETKIUjKFOM6u8oHTKT4daNHuF2bgVdxMpCgnW6j1dz7QN2JloyPmvZwTsI3+0PhbDkDIeyLgVJZQHibNq2tqRWYz4YmJUooSTLDZTmBJoK6PXhDZoD05Fd8L7Ol5u1mFJUKIQoOM2iiNW0G9oscbsuYZmaZNSCo6n6QRE2XgwQqWFT7uS6U1oAOQd71gGHxEufMCpqwG+VmSRW7F9Y5dV5M6dJOKLZGCxiUshYUlrgpflUxVz/hWYVFc+ewO5y5PCL7GbVlpRlQpI4jdCeBnqm1SlCyLk1u7APS2ghHiuEUV9mcx+Hw8hWVCCogVUSWfWkebPxGQlQABO4Wi42l8Pz5iytRCn8hwAhb+kAJyqJBHCElwPHk02FmhSEkmrbx9o6M0jZ+IbuqppWPYO6xHpIoV4NBcqSSwc0PpFZMKU+EKr8qgzN7xZ4TbRe19XhvHYqUUhxmVetWgRddjyV9FXg8cr+0cmhpaFoqUMVakEeTwTB41JdlJlh3KQ4ewMWX9UJRlQBl1evvDcJ9C02uymOZQZiQOceIlRpMDtElgpjDOMk4dSnNDvSw83ii1UvCUtFvlMzAkmCIlRejZsl6TvT6vEzgJSRVZJ4NFN2JLZkVCJbB/SG9nYdayctBrFl+jw5IGZQJ5faDKwKpZ7hJF+PpSEc0+h1Bp2wClqlqfKNz60j1eOJsK/lojNQVGsSTgyzsW3wyjH0WU5XwJiXuDx4ZRFw0WEnOg0cdIlMJVevvD2JRWdhHokRa4fDpNC/RvrDGDEtK2Idrk+wEB6lBjptlMnCktBkbNVrTo78eUXap0lCrJ618tIliMf3CZeXgX9oR6vwUWihTD7NQEstAU4vUHe/wCboMnZcsKKggsKsQW89YTRtJQob74sRtZJA7pfWjiEzZTFE/0Esd5MtlDmQ3n7QsNqLDhUl0szC0diNqy0JDVOotEMNtCSosQzjVVPKFbYUkRwyJzEpyJF2egEeY+ZNmDLnb/S8cvFykLFjyNIZmyu2STLmFI3ANCjcFNJwyy0tUw5Hq5HWLORipEoFKSEkGh374qcRsiZW94WXsgipzDi1IZAdmjmITMImLWFONKAcK84ck45AAJLBm8oz2ClIYJ7x3nvdbCLJezO6G8O8094KbT4A0mU/wAR7JExRmS5iSSajXpwjLLkLTRw8fQJOy1pLhL3rmFeHAaxE4UqZSkBKQKkivNoFtGpM+fdlNPyk9IfRjsUhg6gBpaNXitmLX4FEA6ZQCG4EwifhSYqpmjz/YxrsNJEMHtLFzO6MopudhvgqJbrGaaoqP8AlSw4ndDuF2N2KQ4UomjgsOAs8CnbGmlTp7qT/cqo5sKwlNsNpLghNxwBI7NJajkVLamOif8AQZm9Pr9o6HxQmTMMnZZdw7bob/pymoA/EwxKzPRbdP3gqBMLJzjyhbKUUq9izndhXcoQzh8HOAbIfMRfJlkfMOg+5goClbj0g5M2KRUYbDTns35wiykyFJvLSd+Yn6w5Lw+pUT1hpCAYDZqEcOlD1CSdwqPWGpklSldwJpqT9OEFEgahPlE/06bN5RjEcFsoBWZS3P8AliyMkH5i3MQsiSAKA+ZiakV7oggCJwkuz15x6qWtNi44QBMkv4RzhpJO6DbFpEClRoojrePE4MPrzH5WDqUptxiASt/FGtgxRAYQC/vA5uDlsS9N14LMlk3V6RJMth4j5CNkHFCSZMr/AON+JBiE6QkBwgDkD7Q+W4mIBAJqTyr94WxgGHxbBsn/AFMERjEvZujNBpswcT5wJUtCrgv1jWYBicSkm5VwYfaBzMUh6SX4FAhtGFRoD1eOVJ/ypbi9TAsNFb+qGZxIQ3FKbfSHU45XypQnyEMmUgfIICRf/DT5RrBQNG0JiSaBjpmTfS5gcraM5J71RzEDOHf5B0f7xIYB94hk0K0xqXtAkkJSQ9d9bn84RylTblOb/c3vaASsARqfKJKkKGpjcG5GStRIUpCg1gCC7b9fOAYra5KgDLUA7lg76Md4iBlqPic6CkD/AEZJ8ahzDwLDQnjNtznVlJA/02HOEjtqaQxFNwSwp7Rb4mUpgHtZketIEjCqfNmZRd+6fvAyQcSiXtFZuo8qweXtWaUsCsh9AfpDmKkKNTp/b3X4nuwBODWioUQOb/SNkg4s8G0Jv9yx/tVHQQJ3h/P7R5AyNiCQiCJRCY2nKt2iP+SfvBpWNQbKSeSh94fBi5oclog6UwBE4aQVM4b4OLBmhhCIKlEKfrUD5h7+0SG006AmDgwZofQiCpTFb/UTonzgiNoH+0ebRsWDcRYtEgIrRj1cPX7x6cergIOLBmi0j0RTL2iveB0+8C/q6v7h5CNgzbiL4mIkxmsTt8C8z/iHPoITX8UpFAV8z/MbBmzNdmga8QHbMPMRk1/EI+ZRKTfvNTmIVmbdwqUhkZlB3GVwbsSSb1vB22DM2c3FISHUtI5kQMbSlEP2qP8AkPqY+fTJ2HLdmZnF0gjzBB9DA+3QfCX4/wAxttBzZ9GGKQfnT/yH3g6VhncNvj5WqcQaRGZMU0Da+zbn0fVyuPAuPlmGxU5PgmLTwCi3k7Q/J+IcSKGY/MD7QNr7DufR9GK4EuZGNl/Ecw3PlE5O31KrmB6p+wgbbNumvQuDBcZFPxArcIl/6mIuPKNtM26jV547PGZ/9SBtYgfiXcPaNts26jUZ48Coyq/iBxcjofpEUbZey/Nx7wNtm3UalZgExQG70jMzMe58UAm4vjA2mHfRplmIkxjZ+N4wA7QLxthh/cI2pmoF1J8x946MQdoR0bYZv3CMognSG0KbhFfJmEQ8haTU05fuI7G0clMclzDwMNIxauPmYr0z0bz5RY7OMpdO0IV8oKWBP+py3Vo3BkpMfwuNWNX5iLOVjjqIqO1A3U1ckRMYoc+kK2g4s0CcagfMPb3iH9WTo59vWM7MxQN+n8REYob29IFho0EzafJPEwpO2ybBzxNvKKleJTr5/wAxXYvH1ZAbifpGSsDLqZtJWqulfYQsrHk6vu/LRSpD/M73rHTsWlHiUBw18rxmMi0/UV06/wAwFWKvYxRYvbyGASlSudAPT0aK6ZteabZUjl94FobGTNIZj3gc2YkCpAG8lveM6jacz+7hZPpSF1LzF1Evxq/2jPUQVotmoTteQkgKX/xBUB5CDnbGHSQpE2v+UH1BZoxq0jSBAkFiITJsfbo2U34mUfChBG8hyd1iw6QYbVKkg9mkbyCWe9i8Y6WWt6QWXiCPy/5TygP6HSXprDtLUuG4f/mJf1RFVFTckxnJeKAGb2f21hPEYpcy3dGg9nO+FzkHbRaY74lmqLS+4N7Oo8a0ELYXbuIll87j+1QCgemnRor5iCag11A/K/nOAiYKbuMG2bFH0TA7TExAUKOLNrrDKJrxjcLPKUAflax6ieQXSSIrGRyz01fBs5k5hA01sD5GKCXtYFs1/wA8o9nbUBFSVQ2T8FUF6Xq8xLB+dvWAzZhBbNXhGcVjzokebwdG1N6X619oDbGUUWYxJeij5xBcwn5j5mEEbQST3nHEVg6VpNQsHpDZIVwCCareY5Ki8A7Q8I5KzByQMWMmZHQDOd0dAtBplPP2qlNEJzHewbz1gmD2kpZAUhI4uBretOkUAmsm/KCJnUiDs6oxj6babNw6SCopA+YZsxNNAA46vB8PtfDKSUgAF3spIYb1APGGAN2g0uY0I3L5KKMfg1czbEt2cKAN5aTyuvL6CBycbKX45ikuWoKtq5ctGeCiYj2yQakQjlJ+jxhBdo0uK2nh5SiEJmrbVSwB5ZX9RCS/iOriSgcysn/7RRLWo2BI3h/N4JI2bNmG1PL6Qel+TBUfENYvb6l/KkDgGP3MRG12DkAndr10EDnYOSihWonckpr1IMDEsFBUAEgGlz/2LnyYQykl0LKF9o6btGaq3dHD7n6Qvn3l+kcEceseJlva2vCC3YqjXRDNwj2WgqLCJIlOWBf89YaShqBQrox8i0ByGSIyJbXb3/aPZstBJyuGam992+JTVlmLUtQ03j+YCVOxBqD1ArGSvkLZBaCGH8eekDzB2LNB5map9N45xCTs9S1uASl6nTfUmg89YbhCO/AJSRY9fpDODwK5hqyU6qVQD6mGf08qXUrzEP3UWDtdRFegPPWBYjaJWMrHKPlAYfv1ibm30OtNfyJzjLbKgKOgVZzvIamtz9gsZQdnI/OcCUo6Ap4Av1oIkcStw9+Z8nMCn4PaC/piK5qb6wMILg3D/wAGDSpoJZSRvI/Lw1hUpCgFE6kOaNrAUn6ZxXhFCxv5fnGCNoGPIgwGfIKFMjvJIzC1QaH8EA/1BvT3iql9kJQDkx4FR4ZiWftATax6WgXbDQExSM7JyjQx2kepXCiZ4P7xIKiliDhMRzEFxCwWRHqZsajWWmGx2i/P7w+kjn5GM72ghiRiSmxobiEcTF3nG/3jorhj+XUH6GPYWgmQziCpWQ3nSA9lWpg6ToBBbQ6QcYh/rBZanc92lampqAWbm/nCBX+C0STMYNpCUilsemrUc3+IkAUADv7U8/O8dhRJAdRUTyp+/nCaU0rSCBzoYBrGl4xqJADW4dLPzjyZi5i6FSjw08hSBy5fXgIOELbuoU3BJ94S0h1YKWyS5APD7wc45wyrbvYUsIgnBTDVgOZHteCjZpupSeQJfhpSA5R9MrBSpbmn5+UgqMMrQFj5fv0g0rDWqw4WG/rFmpBSkdxSg1OPGjwktSh4wsqcPTwhyNetekelAzlndwwFnezw9hZ40SkAhiNAd5JavWE8RjilRAIy2ZF3p8xdjwqGjKTbC48Ap2IKVWo/5Q9YknBkkl8qS7ZqBrpNa2gEzEnM4CRxqpdd6lCnpEJqgq6yrgS1dxa8Pb8Fpej02bIRQJ7dQ3qyoHQHMq+8aUhbF41cwhRzACiUpolHAAAQrLUUsPlJsB6gg6R6uY13ILdd1gYNfJrIHFDMBXMbt6O0NMOZ0t1saGFAhiTrrvFeB9INLSXZ3G4B/R4LSArCGaC5cJHHTprC0+SV1SoEb+Oo4QyAAXEpYVvHrSz9YglSsxSxPPQcSKPASrozBScOSl3qHepfmwqYflJLVYjmKHgS2/3gMkDtAFC7s3mCN8PyZKSQWZVaMztv4NryjS5DE8mqBTxoRdiGb6CEMWk9fzWLPGlHYgg95wLcC3p1qIplgu5hEuQthQgu2hp10bq0CYiluP0pEps00eOKxlepGtbPaKqROULAkvESqrjygkwHxDX05wAqfnFUznkqDicWvBZc8ajyhRSWvYxKMAYTNBgiVQgSx94MJuog2ZDecx0KjFNdIPGv3jo1moEnZ8w0KW5qA+sMy9hrIqpIawBfnyi27SgNupH0rpHgmmrgNp4jZtGDWNSfOON6s30deEROVsCveXTgw9S8OydjyhoOZKvWrCPDNyGj8O5Wo0qHFBV4H+qzEqFUg6JU1g3eGpqOg5wj3Jeh/FeDIwMgEOEaaraz790SlypANJaSQWZl7nsSc2kBw20BMLIRrXwgg6igL9Dzg69qIPdJZQUaFkgt0L9K10hHGf3/AGNaGJcwGiQ3CjCli9um4wPtkk0UKcEk8agdb/aFpu15SVlK0sbgpYhSSbjV6eG8FVNqDLbexJFNaV36sKQNt+oOQ1h5KVVVNY7z5NSoiWI2KFKJRNSAaWLK3P3d7amxhPtbqCgQCQTmSAC/eFapZ9xo0MSlhySFA8Mw404GsLUk7seNPtDavhGeAFdw9Sed2p1EeowOIASCmYp7FJSrKdHSg2NavWlDHuGxy5bKQeIdwCDe5boWsKxaTdodoO8kVVV1NpQij/zewhHOXpRJLoyM+dPLhUjtALliwDOSXHdLfhhNAwynbtJRHzFiguzgpJr5xrDjWYTUpISS5JV4GfMmrgVFS58W5oSGA2fPc/8AjKrKQqYWYucoXQuNGN9I6NNp/X+iU0UadmJCVKS6qVy5gn2cDnEcLKEzuqCQGoQa2s1zv6Rcyvh2dIqmfhwH8S1qDJqA43tpRmvR4ZnYjswn9QhRJ/8Ac7uWhoEkAU3BRcvo7B5OSXHIEo+mRx+D7MsXalWvuYakX4b4XBUXIIbU94/uI36JkqYklIzMzi5G56c4r5uAkrLJOVWqSMp6ceR84WP6iuGjPS+GZJEokBlK3MB3fKGJCCLorvCUp9h9It8bshYsT+Wrb0iqODmCij1qfQ2ii1FPpiOLiWOHWC1wNzdLNTn94VxS2N/3j2VJRTNMq4ykEU6C/lB52EcNUgHxKYjcC72pYDnAX4hfIkzqB3abjVokhTKNjyvyeF5uHZRTrwfpBZeEIuojnWKZISmTxRGQ5XDsSHvZyRaE1DjTjp1ieJSQqtWtRo8lGkCzEUKrUhuX1huUpwSGKeW/TjAVSTf+GtX+TBEM4oKW0fgWvAbQUDygPmfLu184V7R1jugBxbmGvWGMYMqxVwwfnC8yU5BYM9WL8xFIisjtEss8h7QBE9r1H5WDbVW6hRmT6OWhHNFl0c0/8hhK3oTHoMLFUeoVGFGa/hMdAnG+OjBLKVilULLADhy4BpoxqX0hiViySAoEuWHdJBoNR9G9IsglCVDvFSRQpLaj/dUHXVr1iZy5wWYKo+WjaZXFTwsfWONzT8O9af2JIwylAskAGtwO8CDmo9b7/eJSRMcASkzP8yRUEbyqhHQW5Q+pIScqlIIuC5Nbu3hP8XhiUCpKvFYhjRO+wLKFX3wmT9H20VkqYVdwApUSXSlBGhNGAAvd2j2b8OKWtJMwozFiCMxYt/aCwrrS1awzjsYHzTAtJ1JqiraA1FbDjC8/HkAy5cxU0qDACqAb1Sp2G/m8Ms/4i4w9PJ2zsKgEJQVKAuXcGlWTppqLx6ST8oUQykZywfUWFi9eNYS2h2+HXlXLQCoOwUSAGDi+8WFa8oHKx6ZiSVdwpa25muTX8vBxlV3YrastpM3M2VkkmhCJeYG2VyHDObKHCDjDgqTmxCs1wlSSMwGhWAcvHdwivw0qbNCaZgp+8CHAckOKg1GretdBg0EhLJCkDwpIIKTR2VdYoKUtbWJz4Y8E32Ve0MstlMXJykApIdyrQAcXNN/CGGxIUmqfmIPAE0IFmeuakObU2GTKOQLSoqByku5Y5mehAqWfUXd4UwOHlp7xVmUpgzgpUxYkORVzZzGqOJneRZbJxCJh7KaXrRz7sau9jrAcV8Jrll8NMzSyPDnYpcWBcghzz5sTCeGbtVKlLSCksaNkBBJICSWIPdagpesWI2ytHeK5ag7oCWSwOYKYOwd99a3hfyi/x/obhrkzmNw8xKmmJIUP7gTQHTeOUenFzESVpl5shGVdyllDV6A8eXCNPgscnGJWmYlaQlsq8ucgqewFQw1jyRsedhO+ZoKCXUUBWfQ5lIIzBLJqRmICjQx0Rk/5dkml4ZvYu0jhyyAVlQAp3iRelN2+tOUbDColYlCwqUpISXNASCznKlnUA/iAFDurGV2xsTIrPhiVSSHBHiAsWdquTF38L7XbLKS+VLad4pIUUrTl8JfUnroEnGMufQxbXBcp2LMQMuYqTViWIpYVL+TtCy9nlQOaWR5EHlrupD0jFLV3ShIWS2QEZTUuOdNbvzhH9WiqFgyyD4SSG5FyURwytM6Y1RT4zZCCHADOdPNrNyNYSRhCgt7BvMg05xoJmNIPeDp3O4bcb15GApWhd6Pv+/51hlqyXYjjEoZ6AaKDj24jWArcUIcaRfYnAkDf0ismSW06RaGomJKNFLikEEGrCz368YXzsrnFtOlUpb23GKqfL03WOkdMXZCSoZSoG59beZgacNUd62tjWBSCksCrL+feGxgSXZYpanmOUNRuzyYM3dLk6Ky+4vCaZZQo2IDk8OlzvpDsuWVpzOQUkAil9Q5FGgWIRcgGlxubeekaPBnyKz8IV99KgQWuWLtW+nOIIwIDZlB9wP1MM4Ugkg2NxZtx/N8AxkhSSaum+6kPnzRNwXYrNlDSg84GZJ4QyXNq74FDqTEcER7I7/OOj2OjZGxLP+od4ZszuBlRRJq7MRU/eLGVjConM7B6K36EEBzff9ovk4TDzUugqs5BY3c2PleFp+yR2ZIUSz0CA7tY10e8cb1Yvw7VGSA4MlRrbRiToQ5emXz6XixVKQRnmKKcoBzBVzW6bFt43xVpxcspACAXoq9XvY6faAK2kpBAApZJJLM3mRvhKbY2aRcTsPKnFnWsF+4UqFArxEAvqPrDInYcZpKDLzEMVMlxqQ7OquulOIipXtMAFGUByCcpZT0F9wrWlYKnEy0ZikMS+bNcjc7etNLwKdGyjYPHbHCnPjAZsgIcPULqznQg6GkJ4eQhBrh5ZlE94qfMEj5u81eDadYv5E7OEozM18rsBRk8ebPWkM4rByiD3Ur1diwozKzOBZuprqNuNcMzgnyjPYZGFoqXNUjKR3VrASp6AJYHJYXf2AYwc5SV5EqLLzBJHeAYg5aN3eIqw4xOb8PpUXCBkUl2SWKSCzAhnLizacYTOAXlyonDMhb5u+kAEGgIST8wDkVfW8Pal7/YvKHdnbZnZ5cucoBKgrOcoa4DOBRNfWAyNnFSz2kpHYywZnaAgOAHcf8AUuQAzuxhxePlqQSpSgtIIUXYKUxGZBIqmgvTrEcNLXNoZgXLAJQpilSl2CCxtWq2qNGto8O6oL5FMdjJS0vLKZaHAJZSVZlDMmySWIfdCysIuYEshSZDOGZiTVyo3NCa7ospuz5KaJJJUVskF0FQQSK5T4XAzDekNFbiUIndoEziSkvkCDlTWoS5CsrFqgmnCKpJc2TdvghhtqmQFhDvZSwqhSGYsm5vbzrV/Z+3CuZkEkCWSkLI7hILuFEHKAXcsGYK1jJ4wJ8KVEgHUN3hSgB9+MXWxZoQGbMa94EZSO6wKj4RQh20sXirSomm7NWRRaQopEkJJQ6gEEq1C05xR24EnUmFFpQpk5WQrK6Q2VRUfEoUBcMXqNd4NjNnJMtJlhCly/CTlqkAuCrK5BcgNqaBnMExEiUSQe4rKFJZdCA4KQPDuHWtxHFqxado6ItMqZM1SVIUFKUK1lsEkV8SQLOBV2FDvhna2JCkJUcqgFEZjcpfKcpTWijrxjpQyLAzBAIUoDNQBJScwbRqEO7PbV4yUrDd0v4bd4Gr2q4emrtakRclatDq6M7MWpJCpZzIcuDVSG4A1DtX6wEzlZj3ObNdrXHmfMxa4LZvZKWxUygWGgspwGZwHvwBOsDxuznSDKYK1DEPS43aUr5WfKHX/QYyaE5WKWkOAWsQxp0I9fWJqx0tV0kPur7/ALwr2qnykMQfr6jjCOMWAXcjizpu1dxgrTTYG2kOTJWqC+794RnqDsRXf784GnE7x1FfWJzZoUkgEPo4dvrFIppiOn0LKkkEEFP/ABYnrDcuZSpZR4C++l4AUtZ+X0exga5mhB5RZSZOhxGJyuoEZWIKR4szU4i0Iom5UEGxIGugOv5aAT0Ehwa6HlvjpkygQdLFqkkVY+cPSYth1LSoZRRXytv/AI0iKZmYFKgx1GohNEwi/Qw2iaFsCwIsfy0BxCmLBBQlvEHhRcytrxZKcUI/eFZqQTaHi/kVx44FVGPYP1MdDAxNRKmykJb/AMeY1ZTgtvBqk8eFosUYmYgWzIV4nqCniwLkb4p5WMBBzSklSdG5aGxpbnB5mMKWJqASaOwFHFKNwP7RxuLs61LgLtDAopllrJqElBZmsbP1NOcVuKndmll0qd7udBuPlQmH5WNM1JAUZe5ibM1aV0OkMzFgpSmYEry8MxBsOTtrGTriQrinyimM1MytwWNq3u9yKCkeFSkgd4ljr4a6ObWcV15M/tHBZpWqQO+nKAwvYjRmNLQDF4RC8OezU5ceIMxHJ/XcN0UTXBNwYaVMOYFNCoA1PN+WkMStoqQ6FtlIIetqBJpyPlxjOyZK5bgqAId3cipoSTSoixVMCmAoW7pBqT8yeIfLS1eUCWkrApM2ezcV2iDLQlBUqpGZlAAABt419xaEzJWFJlTHUMxJBFSlqUGos7NzeM9gMcUqBBMsirOSCLUDWbUCkarYGLWSSgqcaGpBNAUq0DFX2Mc84OJeEsiqRsyUtGdBIAzEBTqWnLVwXZKX/ue96NCf6BUsEyCezJq+XLV/CyaJc66Vs8aPa8ueooylIJI7RDZQRXvABxmNQW4axUYtcxJV3G0GUlgbaikFTkZwSFtmzZspUwzGMtSe7kdYBAeqeKRXQhoivayTlUwdVQopY5joGNBTjQcXic3GolS2TMIJJ7oVqGBDs7P6vA5ywQFTEIUFNlLspJdwogC9xvvDv8u0JdFFj5CwtZIOXMXUBUO5D7iwPOISZ5SAEqIFHej0qWZmDGv3i3xuyTNHaS1s4qCkkd1LCo5GraxS4rZOIlmqHejgg8QK1ekdUNSLVWRkmnZNOKqDm7wYpKd4AYhrHjeDTNrYmakp7VSg4SQVByVHQmgD60vFZiMNOSf8SWtPEpPobRLD4hm99fOKUhLZ9H2ZJT+nR3gpSXzUSoIzE0C9aOPNzDMvDpYUDgEBQzBbEEVZ89CSHdiaaxUfCe0k5OzNVTMylElsqgFFJcguaMzfPFtNs6aAgsKHcAQ5rYekeX+pi4T+mdulUogsJjFFRyh0muVTgjusBR8ys6W0bNaOlzkTEpUihJ3OzBykj5SHIrr6jmgLDVLAOAbs2/cfrEMOsWckFTgFnDtYgvej3iSoa2me4+WFAqUCdxArxIIvx/GpMbLQA6lU1/mx/HEXsycC1KAGlyqjkOf3vFJtXZSVioKkkBiAyklr0uOHvFNKk+WDUtrgrjhwQnKQxDhuNRFdOK0llJ/3JBaLjC4JSUV7yRZYICgLAEB6X3wtPBscxG8Co6WV0jqjLmuznatfApKxLhr/AJ6RKao/n3uIVnAAghRL8K+kSM4te2htFcfUBS8ZLtGNaRGYAofn4I9E8KHeFdw9xApkhQDg00P3gpAfPRF6ZTp5/vA1P+/0MSE3RURW45Q4p6jGqFDbdcftBMwIhWYl7QNymDimC6Gi0dC3bnjHQcWHJGkTtBFuzDqHnUA2tWG5eGKS4LJNt7uQI9jo5dRKLpF4PLs9RMCSUiWkEOTuJbvMLekLJQorzpUzg0ZgbB+Bc1j2OgPgJ7s/EzGKFAlIzVca0I6kDqBDqJlClndquQSHoOjegjo6F1Owp8FVO/xFqYAMxq+n0bThCmFWoXYk1RQXu/Pnvjo6Lx+CLXNksGpRUpCgklIJe292bpS0XeyZq0Fwo1PowcevrHR0T1htE0WJmrYrl9490hClHusCCUuGempvHshIxct0KFLuDmexILMajWOjohCKZeTaRU47ZyAMikgBJ00L1UKnKXFhS9K1XkYQqWyrAMlNKMGAVp1qXLx0dAzfIuKIS0dnNS4VWpCVMzuCNQdR1gAzSVzASVAqubgOCGD3pfTyMex0PF26JvhWNlZQn+7updSgKgtlargghi93hZWBw8050ooHUaMS9qg1Y6HfHR0bpWg98M7B7MlIImIWspBzMreDuZ6Vaupi8l49VO9lAWoEVJUXygHQAk8b+fR0Tm3J/lyUisej0rCipnuAXZ9DeE1oBoRRQuGSTUpV4bVB8hWOjokvx6GfIM58w0YXd3s6SLO2vtEpuLFB4ixVzSGe9I6Oh4fl2K3RwmAEZDcORvDcvzyivxMhYdSDmGooG11Z9Y9joZPFoD5RXTkIWaUPJuvDlWFJ+FUnj5PHR0dVtOiHasUZ6NBkzVJoajSPY6Kv4FXVnAoV4hA5khqu/wCax0dA6dDrlCs2W1oETHR0ViSkRaOjo6HFo//Z",
  },
  {
    id: 2,
    name: "Great Wall Explorer",
    place: "Beijing, China",
    price: "$24.99",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSP1DhX9FevEWM9cGBMaVZ_l706wTbEYbTl8g&s",
  },
  {
    id: 3,
    name: "Safari from Afar",
    place: "Kenya",
    price: "$15.00",
    image:
      "data:image/jpeg;base64,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",
  },
];

export default function Tours() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #e0f7fa, #ede7f6)",
        }}
      >
        <motion.div
          animate={{
            rotate: 360,
            x: [0, 50, 0, -50, 0],
            y: [0, -30, 0, 30, 0],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{ fontSize: 64 }}
        >
          🛫🌍🧳
        </motion.div>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top left, #e0f7fa, #ede7f6)",
      }}
    >
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontWeight: "bold", color: "#6a1b9a" }}
          >
            VirtuVoyage
          </Typography>
          <Button href="/" color="inherit">
            Home
          </Button>
          <Button href="/tours" color="inherit">
            Tours
          </Button>
          <Button href="/login" color="inherit">
            Log in
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ textAlign: "center", py: 6 }}>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Available Virtual Tours
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Join immersive experiences from anywhere in the world.
          </Typography>
        </motion.div>
      </Container>

      <Container sx={{ pb: 8 }}>
        <Grid container spacing={4}>
          {sampleTours.map((tour) => (
            <Grid item xs={12} sm={6} md={4} key={tour.id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: tour.id * 0.2 }}
              >
                <Box
                  sx={{
                    position: "relative",
                    ".overlay": {
                      opacity: 0,
                      transition: "all 0.3s",
                    },
                    ":hover": {
                      filter: "blur(1px)",
                      ".overlay": {
                        opacity: 1,
                      },
                    },
                  }}
                >
                  <Card
                    elevation={3}
                    sx={{
                      borderRadius: 4,
                      height: "100%",
                      overflow: "hidden",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="180"
                      image={tour.image}
                      alt={tour.name}
                      sx={{ objectFit: "cover" }}
                    />
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {tour.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {tour.place}
                      </Typography>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {tour.price}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ px: 2, pb: 2 }}>
                      <Button
                        size="small"
                        variant="contained"
                        fullWidth
                        sx={{
                          backgroundColor: "#6a1b9a",
                          textTransform: "none",
                          display: "flex",
                          gap: 1,
                        }}
                        href="/login"
                      >
                        Enroll Now <AirplanemodeActiveIcon fontSize="small" />
                      </Button>
                    </CardActions>
                  </Card>
                  <Box
                    className="overlay"
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "rgba(255,255,255,0.6)",
                      borderRadius: 4,
                      backdropFilter: "blur(3px)",
                      pointerEvents: "none",
                    }}
                  >
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      Explore Tour <ExploreIcon sx={{ ml: 1 }} />
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
