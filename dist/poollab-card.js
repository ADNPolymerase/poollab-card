const CARD_VERSION = "0.3.0";
const OVER_THRESHOLD = 100000;
const PL_LOGO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB3CAYAAADIMoQHAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAARGVYSWZNTQAqAAAACAABh2kABAAAAAEAAAAaAAAAAAADoAEAAwAAAAEAAQAAoAIABAAAAAEAAAB4oAMABAAAAAEAAAB3AAAAAIqywj8AAAHNaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA2LjAuMCI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj4xNDM2PC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjE0Mjk8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KBR22qQAAJg1JREFUeAHtnQmcFdWd76vu2ns3NCj72qiIAoLiFkdcwR0T92TeGJ0x2+OZmSSTiX7efJiXMZMxmadv1MmMZsYkE4niFnCBuCRERVTEIBEFkU1kX3rv27fvrar3/Z1b1V6abui+0LSX3PPh31V16pxTp/6/81/O/5y62Faepiuuu+63oXD4PNdxcnqDcCRiOY7zk2cee+zrOTWQJ5VCedLPQjdz5EAB4BwZly/VCgDnC1I59rMAcI6My5dqBYDzBakc+1kAOEfG5Uu1AsD5glSO/SwAnCPj8qVaAeB8QSrHfhYAzpFx+VKtAHC+IJVjPwsA58i4fKlWADhfkMqxnwWAc2RcvlQrAJwvSOXYzwLAOTIuX6oVAM4XpHLsZwHgHBmXL9UKAOcLUjn2swBwjozLl2oFgPMFqRz7WQA4R8blS7UCwPmCVI79LACcI+PypVoB4HxBKsd+FgDOkXH5Uq0AcL4glWM/CwDnyLh8qVYAOF+QyrGfBYBzZFy+VCsAnC9I5djPAsA5Mi5fqhUAzhekcuxnpJv1YpSLQhoQaagNyu3TeioW0pHjwIEALqIbx0IDoSHQAEjlW6Dt0DZoJ7Qb8qA/xRS68sorx/Di4eDlU6nU3oULF+4KrntynDFjxuB4PF7RkzrZZdva2qxoNNoWiUQann766b3c8zoDWFI6HJoGzYTOgoZCJZDupaA66EPoZWgRtBpS3p9Uuvrqq2tc172Lly7zPM8Kh8MW169ce+21//L4449Ly/UoAe6XaON8fjukR/WCwtR3bNuupw+rZs6c+eyiRYv+2BFgqeFJ0Nega6DORpPU9TE+fY7jtdC/Q09CW6E/iTR9+vQigPhfAHINDLVgrOWDfEZTU9MrMGFJDow4JRQKzVR7PU3B84N6sVjsgiuuuOL6bIClZs6G/hmS9AYpkNhmMjS04pCAD8A/kfMfQ1JVd0NS3Ud9qqioOJOX/HNf2oSIBzBhAKpCTf7dhRde+KWXXnqpvoeMSKm9AGDa2sug2XywNgDXpo60yCjKSstKm5zP9dRsgCeSfy8kCVaSXVXjf4TehtZBrZBssUDVC9ZAlZCk+puQBsP3oUboqE2zZs2qAoi/A4AKSS20DmqEqVMEDvyeWVZWdjUM+DmUk39CW/qZp1dpT/w8YKIfIZ45FrqPfggfk6g7PAC4ipw5UACuRuRK6AHoaWgP1DGdTMZt0HWQVLbSbOgP0KNQTi9Gvc96smH8NTDzAoEJb9Mw9T6OmzjOpfOl3Itw7zsMhMW//vWvN+b6QrS565lnnlnezfrLcPj+hjoD1C8l+hMx4sz55T4pX2kVdDv0U6gzcMk2kv1tjhoEgcTK8/4uVA0dlQnQRgLgtyCpY6nTVel0+tFBgwYthKG/9fMkxSfiUX8Dh0vaLadE23ZPKvL8fcrTh7QkWDb1r6AA7AbO/x56BTpYSlJAdvcE6Ea/sLTADOgR//qoOQisRCLxddTnCZISwNT73x9Mi5Ag+SLnwNgqmG0xXbkFh+vX5PXY4VJ92i+97LLLxhyMgRoIeNDlHI165vmqkuB6swAeB52mHD/9juMzwUU3jrLLerFLoUq//FUcpa6OKjXd0tJyKqDd6jNf0vt2UVHR4/47WzB5SWtr6xMAc6uYTuqfq8OlZ0DTeN5dQfsHOEYwG6N43gjqODx/J89/rbKy8i0BfAZUnFV5Huc9nYi9Sx3Z7HP8dk7hWAI1+9d5f7jkkksqkNy/5UX6i/kkvds9zHfbPWXOHSTu/8HgmTB7GEzO2eHSM2hjjEgPO1jynTIVa6TuIvrwf+bOnVsrgGdlVZYX/Mes6+6eakCsgAKAB3Iux+1oAdhGki6H2ZcKNJgn6V2STCYXTZgwYR8bu3Hjxg9Hjx79Sxj+HRgdps6hOFwNtLEdPh4wUYbH2KUUGqzncRxF/06jb1t1cXxWbcWZW7Kue3Jal1VYdl0O11GRLr/88iEwTtIb9V9IIryqtLT0vJqamn0cG91HXcqjln0u8QdE4HDd2d0Ily+Rb9DOfQwuNdtl4nkhniNJ/y79HASdR73x48aNW6uaUsl3+LU1GodA6/zrnhxGZBVu4vyokF6iQSUw7C5oksBS4sil/VUY+1WT0eEPEg5/vfYBrnqA9FUcNGm5RzoU7/KSdj6eP3/+s10W6HCDgfhn9Otq+qVAxyCOd4Qo83so0/NM0PzPOtTrzqWcq6lZBT/mvDbrOp9PL4ZpswQSx3biheS3dEUaFAo+mPJ6eQAvA7BvXnrppSN13Z1Enf20w0HqSWuYpP5S/3RJ8HuQ9LwkV0kRmIehrbroZrqEcjVZZV/lvP1hWfl5dQoYg+jwX0OVAguGJTk+DfO6ZcYoG6aubHc1dWW7T0GSb2W69Q9yyLrBjDhOW79ulJPEKvYwWs8JkvosgHdAz0N/6d9QyFKq525IqvZgSeVvhwKV1Mj5UwerlAf34Y/9RRh3plQe4KjLGrhzyOs2wNRtpZ2viPGQnK4vo6oX0s5SNdhVkgSSJvHcwHx2VVRaQp07BjrRr2c0B89+QwBrJP0XdCkkKZYjcRskp+lRqCtJ1ug8DfobaBqkpOHzDKTYdV4nlgInwKCvAkoUBgqcOq7vfe6559b05MXQAg9Q/2KAGi3mcz4M+mumXasIkCio1J54RrtK5lxlJ0AntBc48IlxAClvwOW4k4H4UzMsqSdAHoQUtFDSQv+3IY0eBS3kaUsFaOqjQSBAJfFzIKl0005xcfFe6H6uuzXCKfeZTFoKZPH8azBJoGiNVfHm+SUlJb/taYenTZu2irr/ST2ZLIfzNGDPRFVf1rEt8iVsIs1m9EwXsrtB8upUJ0Ffd0CvMxj/L3lLJMFKmv8+BI2AboKkbgdDkuSzodWQVHkbJIdqGCTVrKNJTBk83HJ75MiRo+vr65ctXrxYD8zLxCCNMfq3A+59egEYJrf5l9jNRE9faM6cOe5VV131C+qV00YcpkvdS1LFex3bjSbPe5HnZk83ud3t5FBf/dvOc9ZCSxcsWNASAKxWpIp/CGl68wVIkiqxn+yTAJNhUF67KuHcYTS+B7hjRowY0Y/O30GIzEIK5uUryMOHD09s3rz53wlD6n01xfHmzZtXC9N02ePEVGczixQ/hDcyaybRdjuwWXkLWLj4Dc8Lsrp9VB8p3EZwo0WDKqjYWY+HcnMWJBUyBZLx7qycRst6aEl5efkiAL0QBtwCSfrfZ6T+YMuWLfOWL18u7XDYU+G/1ekeSzsbKluoKnW9DJITJVUsdS37K1srYHdD66AV0JuNjY2bGZErsFu6/xfQiQB9x9ChGitWr4GsxgvpwBzoDGDVkK19C3oHOhbSfFAAS5IDgLdx3u4FYp82EPW5W2oMMiCjku4sgAyX+jB1BXDQJdldSbTooIndBxuwNf+MsVf0+2bU9HgfZA2Mx3pLXR+0Y3/CBcz05nC+v7aoAKqCJA9DCR9kqevrp06dKgftM5MYhO3OyGemU4e5I505T4flEYq5stj9twB8M4BrVWW1HC9s9WPdXVE5UEcO1cni/z3UNsjf0K+HifPt9yjlMJe0tJmcDXQWU6f9ymRnOJSrb8oE/tiy2uMF9ey2Dse5+p92nESvAaxOCmTc9+9w+uXDDfLl117zcigcOR+QND1QpMkmGJiZVfJWit4d6OV0j9J1dii0XfW7SlMmTrSOGzfOKgHgA7UHM63tO3ZYbyxbZtXW1VkaQH2Z1FcmxrsP1OfD0r8skCXJpUjMGsC4KxdJrvniv1YURSoGusnkgHOGb7+3rDQ+yXJtEOaPk7bSyaSdaG0OJVqaQ62tzeFkSl49gQUTqt3/dfTycgo7S2nCikMGD7Zu/9rXrOHMBtBGnRVrz+O9rPqGBmvB889bzyxcaEX7GGCiKZaTTm8/mJPV/gK5njz//PObfO9aG8MlyccD8J0E3G1WVR49mLqumf2v8XBzv1HEfvhMxBmbctzhXjgyYNzE6f2HDyxXUIZ1Mf6k03YqlbSSiZZQY2NtuKF2d2jP3h2RvXt2RBua67SrgvW7fV0OiT596fTV0qmUVTNqlDXhhBPM/TVr11qbP/lkP8lUfYF/+tSp1pBBg6yzp02zngNgYpLtEq8nSN0fLGmoSfKzh5zqqT5bOLscjGq3vZxfn53wyja7KnXSqwnv+mNA/pGkJQCZkNwdbGITyL/qDOTpc34X2bF9xwlOmzPFCrtTgGcMbzjACntx+u7FyquKKvpVuCk4aXsE8T3CiXoL13MYuqlUW9JubqgL7dq9NbJ164bolq2bYvWNe6Nwi25ks7DzVycIbCkiF6Q3337beuHll7WxLsgyR0mubLRUue6VV1RY/v9NLPVgwInA9BHDhhk73tWTNVCaW1qsbdu2tQ8OATtq5EiruKjI2rh5s8WGPrTR/i2or6YcZuTjjz+2EpQL3rHXJTjgRgAyEixJvkWSjH2+g07brKz8ipUVBeNNOun2ucd+sn3buYznc+1Q+EQ3EqkgxMJSC+qYoDpm13MiIS+tAYPl1fSc14abAppr8sPRIqvfgEFOv/4DnWGDR6e2DN6YWr/xg/jHW9bF29pawx2l2X/0PoeAScpsxIHavnOnFceByk5ibmlzs/XeBx9YhBmtj5Fy1IL6YxJq0oB/yUUXWSxWmL5l128/p46e8fSzz1rv05bClTDKmnnhhdaI4cOt15YutRa++KLRONn9ku2XprnxuuusUtp/4KGHrOYtW9DQGW11xADWiwhkAu8/AiQlhTWPoyPf08hHkudKkmu+MXdCazp6pR2zpoPoQL72cTw7nM6sV9EImsf4VQrrRnxHBitMezBWLwVzOccuW4wEO0R2cWm5N+64k5MDBw5O96samF6zdkVxQ1NdtDsgq99KYqrUJJonk+H/DfMszIP12JNPGskRSAJdg0xJ52egtkUfrFljfbR+Pd3etw2BNGH8eGviSSdZm5DAP65aZVYi9E5jRo82ZuKYAQOs3bt3W28uX276oNallgf0729df8011pm0r/L4NhlemKdnVjT80yNzUOD94osv/rFABVwDMojd0ZZoco+bPW81kvlFWHm6E7UjAJuywgimmJXhl+mk48DUKDsbYbgLgiFJsZgqoHXOMSjuAnSIQYE02IDrTJ50VqKsrMJdsXJpSW39rlhPQO6UQ/RNAL2/mgU3DQLA6whgFWpbafkf/mDNxwnrqAWSTLFuvukma8yoUVYVZsEMVv9heMJGM8hc3HjttdZePPS169YZVa2p2+evvNKaOGGCUe/F0hAd0r5eR4ebvXX5wgsvbEadSZL/E2qCMeOaiofPdqORr+BAne3EIyE3FnWcoqjlxGOWqyMjMyCvGDsYwauVGoKhrkjnhhgQeGSeuZfJc/WW5Dmea0ejMWv88VNaT5t6bnNV5YCUi1o/lMRwMup0EtIngCrLy/drLgBMtlFTqLr6+n1Iea3JdgvVPjjVkLrekkhYv3vlFWs09vgmQD5m4EBj22dccIF1wfTp1uLXXjPSrbId0xFV0dkPx+Z+gu39cRRbmoxX37SremI5646TGP6uEwvzNTU2KIzhhdCNmaqIpQSVZXDL1WdVAlFJmdwz0mrUtHGsufHpXNgj9GBUN3VJ9riak5Oe61hL3ny5vCXREDmYJAukgNRAkGQnI0jSdV/4gsU+aWv9xo3WE/Pny5ncByiVl5qXbQzsY9CGrrPtapAf1HHREAuee84qKy21zjnrLGsnvoDU/azLL7fk3T+1YIF13Nix2dXaz/sMYPVAIJ9z47cfbqwcflZj1UjbY03Txa56UcCNcsTRcFHRkj6DoKY5OMnwzoDuRpDKNGrx050uFpj5uAtkjQYxloGiB9KMiU4KLMLlNWMntjU217e8/c6rZY7rmKeoWJBMHf8ixlRI3mysEy+6hPzja2oslk2tYUOGGIZn2+GgPYEuRyzdYb1XebrXVdIA2FNbaz36xBPWgOpq6/zp061TJk2ymnDu5s6bZ5y/jr5B0FafAnztvHnh5W/FpqJOEYNw2AVUN06XYKbDuRUCaCTVSLHssJLHPZiBOs8gCeaac4azvDA22TAmuOGPC4/mjbOdaYEKwh07DaQTTji9defOrVE87GI89qCEOUoigySGyguOdgBHUq3QZMQPhLQxf5bz4/eWB5lhZpoROOMYCHG/bNB2kjr9qrRYZ8ZjkL3PUXZ9Aw7YXED++q23WuygsR762c+s1UjwgYIqfQrwu0tLzrLCzq0AG/HixCJglMfLuzGkN4b0AqJrvGXAMuLHEZvpOox2DQBe2nAyjQJm3QDll1F1RnAzoLKPkSK+BEuaxTatMYjxUHFJsXv2mTOa9tbuitTX74kSujSMFZCr3n/fTHs0h506ebJ1CnPdzlKgegneWK8sWWLx2eg+ka91eM5nnHaasZfTTj3VOEjZ7Uja5Vypnspmq+tsz10gr1y50rr3gQesUube76xYkWlLql+8IGXX1XWfAVwz+/l4OpS4wYvGSlDFKRfnx8Nxcg3AABLTOd2TygZkR3ZY6Ag8JAQbjcCF+BCHzCgSo0ARHrWdBjxNnwh7SEKJYZJNHkwQ0OYfEp7R82KBZw/of4xz0vipra8vezEzdVJZGLZrzx7r35hXyrkpQWLM4FCVTpLA2ck05j2mOFHNEHyNI5UuJ6i+sdGocPbNZsxFVhtqV1qIvWzG01adwC4vJLhSAZjSCgqg6D3WYecFpAZjRAOSc35xxQwSOXAanAZwz4sdqM9ZXTj8p+O+/cTpaTtyjxePRVDLnstLyWvGe7bI4yg7LFWdsce8hflnuJN2rJnHFFUMiYUiHvbLgEqe3ZYCaNcKp8hLCXTlcU6cWvdClAkF9zQQsOdKNg5dY8Pe0OrVLy6xQ4m9wdvKLirgINtrVLMv3cH97KPKSoKl1js6USpXzPtpashTu0yqm1B9v4TKlmMWBGyDVqp8O23a4Dz7OWWUC1GuGbvMD30YyW1znMY+k2Ds5EV2NFzCx6xJpkbYWbqCzYWjZtojR8vxQVaex7xXTo8JSxJhfaUh3RhNs6MVyQm3AmxbkqMPZGubxUqDZXOMMMe0EmlztFspk2wjH7C5HwAshsKvmOOM+P3AgSsWZr58pTtIsRgm0lTlYEkrTp3NRVVP89eDtdGxvvq1Gy2ietXYb0mqkhkAvko2GfzZRDlGmFn1Uh80CPALnD4BeOpt8yrrLftUB82rKZDmrC49kb2U52wARV1Lgr24L8VSu3pBghxhAlvNSZlQ1+OUQAbBDvAKcy/URpNIr9XKKObcDsBNADrSHEowIBJICUBbqSx5IuoZDhePX/DolIcta07WjYCF+XkMtMER7f3uqDuW4MMQdEwmBKleaCrjg+gx/XE1aeGoPDlcuJ6WV0QcWEEPqe04LpXmwjhbIT4BknrSdMjkYbNDUdlRplBqU7aYssZuyXbpnEEV1n2f8Lod1ikmnDnD7D07ovzozYf1CcCYzuN5KcJRfvIdBV2ZJSFJqiQb4IhFm3M5Xw4gayplvGdZGX9aI8k3HpB8q8BWmwzyTQqOXPinUvfZybZlkEP9UfwjsvPz/bxPAEa1joSZPu+CY0eW+7fJ9jSnNSkow5GJbeYqCzy/VPvhALdUpqMeRm/E20L2sPb6R8EJYtAHyeMHThVKYmpgUiZ8CJKayzKnFec1tfGnOB6er+xvWNMbbprFbBWSJ6kmVN+U/3TYaJ5LpiGDczaanHfEXreZRpHS2uh/1KQ+ARhPuNQAIgA0pyU6JUdJMWbPAIdpxlP2CEnj87OgREhSLAcVPgOzQpr2MM0Jqa4L+GhXGwfLgEqWpkp8jWUcMh9jKvv3TQaXIBroBTWtc0rInuu3Lo6a1DcAs/2C6CHxCsACCM1lWcHX93SWHYVSsBr3mDiG+cxOu64iXMsmG1MJuDZSHdJct415L/WMFGtOrI/sNF+kXQWsAmnXADLnElUhuZ+CzmAqxzxzdnT8zR7ER+6N0nwpb1Qtj/QlzxY4SKPmtSGXOQ9HnUcUvNDcVcc2tqIwtw1xHta1ykiaFbygfhgQNUgEoAl+aOVBz5H/JM1APr6yeU5GhXcCsxs6+IS3C05pTEExgln7bvvoovyRyO4TCeYnYWrZQKdtfzCbaUuKcYYnLbXs8IlsKCUhShu1bKQXoDyV8ZMGh+yzolVhfyBYacDWIOE6zLlR/QZMysqEi/smesW1GVRBa9lH9ndFQu2RrOw7XZ03fFJeHU7bZ9DqlMaN9jD0UfmwYstp3BTaS9R8PfGZpRsaGlawJq/PgY546hOAYfAWIavQoZsiboq+dgQGkqgZjwMicp4EivI9ADeOtDwjOKn8kNS0QpEMEtlpE9RQ4MK0wz3uh3WfZxgbDfiZo8Rsfz5TUyY+7SZCG/a/u3/O1q1DSsqSLdfxvGsiMWscT6zyHK/Yce0ILgN6njeLhJqSjrd3VFnlGw3r3F9UjG18bf+WejenbwB20x+G3AgiyjpoWkEHM9VlRSjzspJfoAc8bX8BYBOu+lSCZWMFLnAYAIPYs5UiWiW7DEmCDbiAHhbIvvo2NlqDgiRQg6TWGXFuVfUHZ7A/bBv7w7YE9zoe967rNyKear4zWmxdTIR0CBaErT8MOhqJyDEkSUmk024limYocZnRdtQ+q35DxYMVexp+Yp9qPrjv2GyvXPeJQzFy2jXJVNK9FL1cxIoPehFkM/+M/yMJQ437jraAQuoEmBwl2VtjczMhyZAWE7i2jF2Wes/Y7zBgy1ZLdStEabQDUqxQpqRcgGagMI9mQIW8WLipqF/JtvPZc3vu+PHjh0ONN9xww87FixcHRa3E1n4jGJX3sfh1BcAeizIJR4maOWmv1XHsjew9+JCu72BAMd23KwBXCoalMuuYouLQxOZIrGjGrOTrP//5PuOrV8BVo77M9Fr7nTc8fU7kxGHD7nGi0XNYFkwqFMk5syUtKuiccacQo8KUEm+FLNuDHUit2C3Q5S0LeKl2AzzgyQbDUbOY4Dtjwblx2FhwaEfW753AdryQ169408B+ZdvGgD8NWbuBSJ+1SK0uJJb/ymuPL3DqExUPsbj0edYwihTvB8cE3v5TSOpCx02tpZ0Ea3R2wo72Lw65k+n2dfT3TCkRvUI8Zu9obrHv6De27r9ot9dT3wDMa51400NXEbz4BzbVJQ2wAlkLDQZkViHawYWL6qWkXMnIEn+M0wSQBmgkVDYWYDNAc50EdHnaIg0ArSAZiUaKaSZbPdMmWaGmypJ1v6wq2XGm54VmELcepg0BJH0DvY3t2yvvmP3ujtOn7L65rc3mR81Mt7Yz8uawq+yF2t2tO4ac+umPz8hNqNtYVcH0bhi/3PANRsJtgJxZprWstV46dkXFmN1r9IDeTH1jg3mjtOcuibr2epg+EmUsD4i9Vdoal1HHES0hovqsFOpP0qwkjOG5fovGTH0MyEAlzkn9Sool1QLXeNcZ4D/1tDO217SV9Yc4dNSz08sT4cTjJW3OS+zN/yXrwOcDsn58dDK/Z3b8gOrWkSOGNifR+GXGhPAbYmkn9L1Uuu6p6nGffggfNMt4pCOsEfJnz0fFP4iEoyWo8v/Rxhy/KGbXJFLJ27j3raB8bx01mPskffir2/bYbc7T2NBQZhEegJCyCMt6RqViQ23OJYGRRCukY4ZCmg+jI3U/pHVgzlWH9lgm9OfIxu765wBunLLO3tRs87BbCIQ8/ubCRxr0LRX7jV/ls5r72Qx3K1Vm0/yzp5y4p21g/0RlmmldJG5bbWl7bjJZ92Rn4HZ8THVNYnObm7yLwM5aWZ902vw67DU7NwzULyf0auozgCWDac95Hpv5Lmu0sTBgyVEScFqUj7BmK5sZEogAawFqKAnp6Odl7lMGUE2AxICdUcUaGJlgSEaK5UV39rIE1RQ7W7Qn4r4bcBoP2mHv9s5nn332XbbiPEKXvjXzvM3vRfAFpEuclFePxP9k4Ant/5VBULXL44AxybUomblantR0PB63h0bc5NQuKxymG52982Fq+uDNrH76f+6x0q0/xUbWSpINYNppYaQR0LQ4D9ghOGwkm2uBK+DMzgwGgaJckl4NEB2N9OtabUhykWSB21lCBbN73vsoajv/vXHxnNbOyujX6F566emNwwY3sbWW6Rw1sAgfbG1pfr+z8l3laW7MTqSFqZSH0cFvZDmafVuTuyp/uPL7zAYHL5BMx5ZVhGvxQMtvdJyI/uMhK4TDJTboCwXtqjT+lbiiEzk+ssPCDNeVL5fM0USp8KgzARCADbxqlSd1MpIjOFENRMX+7a3XnU2mUBd/6lZUlYSrvGothkRxkdlM8lEukammBmdTrCTcgBBXm63ctjesi0cetuw+B/ik+G+Hpd3QxfXOsOq69OidDG2Fr1hXEKLaqYEEymXNTkiSiUqZkCMX6DwtWiiwYYCVDgT8IHWoLe9He0ESjKAH9sRSrx9si07VKMuq38u2Ar8heti5txY8sItjsiLcFmujrrjOuGMxRL8p1qvpsANMv/VRbX9IP2qh+Ks8yT2SPY77JP6XEj7qdu+J2N7ZVeEtfLMS2dTUOozdM6kiNkg5Lu6ybRQa1bJBlqdMc0aKBa4gY4oUrBwFCwmdAIsSYG3Ssxuo/mCTV7to4+K7O1XN2R3dWFfX2s+uaATgQS6DChdpaPb97p5XNMCXErtM+6A1fEk9intnqvTs72EBGOTKeOx06DxI23EGQFpR0UivhdZR5jWOL/FiOzla1wIuIYd7sYMXci8eslMrKuxd/7s5NWg0Lu/NxKcrAQjDyl9UtVSazxSwpYYwBmjFpTOLB2TovItESVUnomRvQvofavJiv1+z5O7GLorvkz1qlJVs2Git4wOmcSnm3XxrflITHnDZ6F0H/H2PfRrhwimzziiKWCX4gmY6yI6HHtnxju115/qQAYalhBwt/dDKyZAWywVstvAIiunQjdAGyt9/2axZ7zR73k/xV+RkMP319H8TfHnhwv/+cNSoOW9WD4+u5Dvv25DR0/UtGYGhNiCmaAAx57rskPRQPSw7cU11O4q0w1Z3ftj2flYSdja/s/i73VazcpDqPwotZH48U45WcTw0qKk1+Zc85x+zn3Wg8+3vHltqpxOzUTvaj69JQUNROPW7A9U5HPcCjvW4Lfirut+GBK5+lbw7g0X8r1s6dOieH02ePIbwJPz2lgpcfhl1Lfd8fOaFT/7cugpGyoXAfzUffKMVWO03ARETRqTo/ikLYPWN8to/aX6rawXfqD3e0pZa9tGbcyS1nQyP/dvLzqndUDQqbMeW0d4Av/JOLx3+fEVN7ZLscl2d126omFMct+9oJW5XUmRbzQn3yarRjdczeD51FrqqfAj5hwKwgL0T+vSHLDK/N/0WeSsg/Zd4Ut0nQadDsssmJRGFxcOHew9MmvQqHfjKvuAGpSxr1PQ5RQOb2cZaUnQaW1rPZVViAmp4gCSSUuo78fwMWESXdG3yyGqF+Fldb0XajSxOOcmVxJqaVq2ak/OaLNo/VL++8h/ZU/69lla8acLkjMYPWMD+RvnousU8u9O0dq0VPzZW+U1G/538AHS5OhiK2M2tre7F1TWNOHi9m/S8HidG8CVUmgtVZVVexPm9kMBFHZqRKaGSyh4D3QbdDCnPShKp31JW9sOx9fUaJL7k6s7+qaZmdrysrLo4Whbvn7bd0TSAnbYHAW0/lmzwRGF/ONTCvqy9vNCWtB1aj5O2iS8CGirTWxPLlz+Y2r/Vnuc0rS89lgWQ+dGIfXoCkHkF+m1v45PUX6SS4ccTpSVrhgzZ2kJv7MZt5dVeW2RayHZviUS9i5jKV2goFiG9rQnv+xV7G75/JJYNewwwfayANS9Dp2ax6D84/3uolgb3YyZ1FACSpMtu3QUF6nwL5+dSZx3H7iR76tT/oO62aH3EipTxgYJTRtyQFG5KeonSYqfZjaZr4g2pxYvndNvGdufBKiPgdq+rnFIc9x7BuByfSPJmpKJYqIkYcz075zfggfFLvETRQ/bQWNQbimapINZiOkn0ihiO+7N0uvGb/cda9aZyL//JBeAv0aeHoQCk33B+Ew0d1OWHHVLZP4BmQ0ri0D9RV1KcF0m6on5d5eRY3P2XcDh0LnFlRbbMi7AmksaBMuslzN4iio7Kd4+zaIIfkWSj8P1us/tPFeMbZb6OSOoRwKCh8vOhK/zeNXO8kMw3/OuDHmhjKIVeg0b5hT/gOI02+HwuP5JA3vJR8eB+RdFbQJYpnTVav9Kv+S3/TNK1bBGSzWqKtySR8u63vaYXj5TkBpwUYN1O9F3z25XQYL/SixwvpZFuq0N/kNxDvdv9NqTSBbBsd16lXautcv5X16GsbH6OoX8WmzdrcATLMcz65YldLE6825Z2X2Mn51ulTnOdPc74Jkf0HQM1292HCtiBWYWX9ARc1aO8BvkrnAYAyyMeC+UdwFpN4n92X2N9Ym1qqK94KlzsRFtDXqhY32zEbaelpamtXyv/E0of7aiEp+12VOfdSbKh2YNia3cqdVJmW4e86g7XeXOpIAidZS91Q877qXvzZc2UpQcP0DxSLxSkkuCkh8fsQaKqB5wm9bDtQvEsDvQUYKYA+zhDE7La6snpCR0K56oJOjRTuDwkDiC6cWglJDsqWgtpftujRJ1n/fpqox4a1aMGCoV7jwOAcXcWOMwCzf/O2e0HUv4iqCmrjZc4VyCkkD4LHACMSVBjFkDbOD+/O32jXA30h6y6kuAbulO3UOYIcQBA9H+o3ZsFknY8ab33eqhLm869c6E3IUm9gBW9AB1V3+MeIRh69zGAMhhaCgVACeTd0DzoS9BEaCQ0HpoFPQhtgfTlb1BnM+dTerenhdZz4gDAaO/3ydDbUACYjqyxWHsggfkR9DG0C2qGsssJ3BlQwfbmhMARqCRwoOOgRyFJcDaAOu8sT/mLobOg2BHoZuERh8IBQNK+t2roz6GXoWznKxtwSfYy6HZI6r1joONQulGoewAOEBo+9ARgLLqbdeLjOE6EzoG04rQE0kaA93xq4IFagSqkI8SB/w/3FmXK1iaWyQAAAABJRU5ErkJggg==";

console.info(
  "%c POOLLAB-CARD %c v" + CARD_VERSION + " ",
  "color:white;background:#0984e3;font-weight:700;",
  "color:#0984e3;background:white;font-weight:700;"
);

const PL_TEST_MAX = {
  "ph": 8.4, "chlorine free": 6, "chlorine": 6, "chlorine total": 6,
  "chlorine hr": 200, "cyanuric acid": 100, "alkalinity": 200, "bromine": 13,
  "chloramine": 6, "monochloramine": 6, "dichloramine": 6, "trichloramine": 6,
  "chlorine dioxide": 11, "iron": 1, "calcium hardness": 500, "total hardness": 500,
  "potassium": 12, "copper": 5, "nitrate": 50, "nitrite": 1.5, "ozone": 4,
  "phmb": 60, "phosphate lr": 4, "phosphate hr": 80, "sulfate": 100,
  "active oxygen": 20, "ammonia": 1.2, "aluminium": 0.3, "aluminum": 0.3,
  "zinc": 1, "urea": 2.5, "hydrogen peroxide lr": 2.4, "hydrogen peroxide hr": 180,
};

const PL_DEFAULT_TARGETS = {
  "ph": { min: 7.2, max: 7.6 },
};

const PL_LOCALES = {
  en: {
    numberLocale: "en-US",
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    parameters: {
      "ph": "pH",
      "chlorine": "Chlorine",
      "chlorine free": "Free chlorine",
      "chlorine total": "Total chlorine",
      "chlorine combined": "Combined chlorine",
      "cyanuric acid": "Cyanuric acid",
      "alkalinity": "Alkalinity",
      "monochloramine": "Monochloramine",
      "dichloramine": "Dichloramine",
    },
    ui: {
      ok: "OK",
      over: "OVER",
      tooLow: "Too low",
      tooHigh: "Too high",
      target: "target",
      max: "max",
      min: "min",
      lastReading: "last reading",
      title: "Title",
      language: "Language override",
      displayedMeasurements: "Displayed measurements",
      latestOnly: "Latest only",
      latestTwo: "2 latest",
      latestThree: "3 latest",
      showMeasurementDates: "Show measurement dates",
      showTarget: "Show target",
      poollabSensors: "PoolLab sensors (drag to reorder)",
      icon: "Icon",
      displayName: "Display name",
      lowThreshold: "Low threshold (target)",
      highThreshold: "High threshold (target)",
      showTrend: "Show trend",
    },
  },
  nl: {
    numberLocale: "nl-NL",
    months: ["jan.", "feb.", "mrt.", "apr.", "mei", "jun.", "jul.", "aug.", "sep.", "okt.", "nov.", "dec."],
    parameters: {
      "ph": "pH",
      "chlorine": "Chloor",
      "chlorine free": "Vrij chloor",
      "chlorine total": "Totaal chloor",
      "chlorine combined": "Gebonden chloor",
      "cyanuric acid": "Cyanuurzuur",
      "alkalinity": "Alkaliniteit",
      "monochloramine": "Monochloramine",
      "dichloramine": "Dichloramine",
    },
    ui: {
      ok: "OK",
      over: "OVER",
      tooLow: "Te laag",
      tooHigh: "Te hoog",
      target: "doel",
      max: "max",
      min: "min",
      lastReading: "laatste meting",
      title: "Titel",
      language: "Taaloverride",
      displayedMeasurements: "Getoonde metingen",
      latestOnly: "Alleen laatste",
      latestTwo: "2 laatste",
      latestThree: "3 laatste",
      showMeasurementDates: "Meetdatums tonen",
      showTarget: "Doel tonen",
      poollabSensors: "PoolLab sensoren (sleep om te sorteren)",
      icon: "Icoon",
      displayName: "Weergavenaam",
      lowThreshold: "Ondergrens (doel)",
      highThreshold: "Bovengrens (doel)",
      showTrend: "Trend tonen",
    },
  },
  fr: {
    numberLocale: "fr-FR",
    months: ["janv.", "f\u00e9vr.", "mars", "avr.", "mai", "juin", "juil.", "ao\u00fbt", "sept.", "oct.", "nov.", "d\u00e9c."],
    parameters: {
      "ph": "pH",
      "chlorine": "Chlore",
      "chlorine free": "Chlore libre",
      "chlorine total": "Chlore total",
      "chlorine combined": "Chlore combin\u00e9",
      "cyanuric acid": "Acide cyanurique",
      "alkalinity": "Alcalinit\u00e9",
      "monochloramine": "Monochloramine",
      "dichloramine": "Dichloramine",
    },
    ui: {
      ok: "OK",
      over: "OVER",
      tooLow: "Trop bas",
      tooHigh: "Trop haut",
      target: "cible",
      max: "max",
      min: "min",
      lastReading: "dernier relev\u00e9",
      title: "Titre",
      language: "Surcharge de langue",
      displayedMeasurements: "Mesures affich\u00e9es",
      latestOnly: "Derni\u00e8re seulement",
      latestTwo: "2 derni\u00e8res",
      latestThree: "3 derni\u00e8res",
      showMeasurementDates: "Afficher les dates de mesure",
      showTarget: "Afficher la cible",
      poollabSensors: "Capteurs PoolLab (glisser pour r\u00e9organiser)",
      icon: "Ic\u00f4ne",
      displayName: "Nom affich\u00e9",
      lowThreshold: "Seuil bas (cible)",
      highThreshold: "Seuil haut (cible)",
      showTrend: "Afficher la tendance",
    },
  },
};

function plTestMax(param) {
  if (!param) return null;
  const p = String(param).toLowerCase().replace(/^pl\s+/, "").trim();
  if (p in PL_TEST_MAX) return PL_TEST_MAX[p];
  for (const k in PL_TEST_MAX) if (p.indexOf(k) !== -1) return PL_TEST_MAX[k];
  return null;
}

function plDefaultTarget(param) {
  if (!param) return null;
  const p = String(param).toLowerCase().replace(/^pl\s+/, "").trim();
  if (p in PL_DEFAULT_TARGETS) return PL_DEFAULT_TARGETS[p];
  for (const k in PL_DEFAULT_TARGETS) if (p.indexOf(k) !== -1) return PL_DEFAULT_TARGETS[k];
  return null;
}

function plValidNumber(value) {
  if (value == null || value === "") return null;
  const parsed = parseFloat(value);
  return isFinite(parsed) ? parsed : null;
}

function plEntityTarget(value) {
  const parsed = plValidNumber(value);
  return parsed != null && parsed !== -1 ? parsed : null;
}

function plTargets(cfg, attrs) {
  const defaults = plDefaultTarget(attrs && attrs.parameter) || {};
  const minOverride = plValidNumber(cfg && cfg.min);
  const maxOverride = plValidNumber(cfg && cfg.max);
  const minEntity = plEntityTarget(attrs && attrs.ideal_low);
  const maxEntity = plEntityTarget(attrs && attrs.ideal_high);
  return {
    lo: minOverride != null ? minOverride : (minEntity != null ? minEntity : (defaults.min != null ? defaults.min : null)),
    hi: maxOverride != null ? maxOverride : (maxEntity != null ? maxEntity : (defaults.max != null ? defaults.max : null)),
  };
}

function plNormalizeLanguage(language) {
  return String(language || "en").toLowerCase().replace("_", "-").split("-")[0];
}

function plLanguage(hass, config) {
  const locale = hass && hass.locale && hass.locale.language;
  const docLang = typeof document !== "undefined" && document.documentElement && document.documentElement.lang;
  const navLang = typeof navigator !== "undefined" && (navigator.language || (navigator.languages && navigator.languages[0]));
  return plNormalizeLanguage((config && config.language) || locale || (hass && hass.language) || docLang || navLang || "en");
}

function plCustomLocales(config) {
  return config && config.translations && typeof config.translations === "object" ? config.translations : {};
}

function plGet(source, path) {
  if (!source) return undefined;
  return path.split(".").reduce((obj, key) => obj && obj[key], source);
}

function plLocaleValue(hass, config, path) {
  const lang = plLanguage(hass, config);
  const custom = plCustomLocales(config);
  for (const source of [custom[lang], PL_LOCALES[lang], custom.en, PL_LOCALES.en]) {
    const value = plGet(source, path);
    if (value != null) return value;
  }
  return undefined;
}

function plT(hass, config, key) {
  return plLocaleValue(hass, config, "ui." + key) || key;
}

function plFormatNumber(value, hass, config, minDigits, maxDigits) {
  const locale = plLocaleValue(hass, config, "numberLocale") || plLanguage(hass, config);
  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: minDigits,
      maximumFractionDigits: maxDigits,
    }).format(value);
  } catch (_err) {
    const decimal = plLanguage(hass, config) === "en" ? "." : ",";
    return value.toFixed(maxDigits).replace(".", decimal);
  }
}

function plCleanName(st, hass, config) {
  const a = st.attributes;
  let n = a.parameter ? String(a.parameter).replace(/^PL\s+/i, "") : (a.friendly_name || "");
  n = n.replace(/^Ma\s+Piscine\s+PL\s+/i, "").replace(/\s+PL\s+/i, " ");
  const key = n.toLowerCase().trim();
  const params = plLocaleValue(hass, config, "parameters") || {};
  return params[key] || n;
}

function plKey(id) { return "e_" + String(id).replace(/[^a-z0-9]/gi, "_"); }

class PoolLabCard extends HTMLElement {
  static getConfigElement() { return document.createElement("poollab-card-editor"); }

  static getStubConfig(hass) {
    const order = ["_ph", "chlorine_free", "chlorine_total", "cyanuric", "alkalinity"];
    const all = Object.keys(hass.states).filter((e) => /^sensor\..*_pl_/.test(e));
    all.sort((a, b) => {
      const ia = order.findIndex((k) => a.includes(k));
      const ib = order.findIndex((k) => b.includes(k));
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    });
    return { title: "PoolLab", measurements: 3, show_date: true, entities: all };
  }

  setConfig(config) {
    const ents = (config.entities || []).map((e) => (typeof e === "string" ? { entity: e } : { ...e }));
    let m = parseInt(config.measurements, 10);
    if (!(m >= 1 && m <= 3)) m = 3;
    this._config = {
      title: "PoolLab", show_date: true, show_target: true,
      ...config, measurements: m, entities: ents,
    };
    this._built = false;
    this._hist = this._hist || {};
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._built) { this._build(); this._built = true; }
    this._update();
  }

  connectedCallback() {
    this._tick = setInterval(() => { if (this._hass && this._built) { this._histAt = 0; this._update(); } }, 600000);
  }
  disconnectedCallback() { clearInterval(this._tick); }
  getCardSize() { return 1 + (this._config ? this._config.entities.length : 3); }

  _state(id) {
    if (!id || !this._hass.states[id]) return null;
    return this._hass.states[id];
  }

  _build() {
    this.innerHTML = "";
    const card = document.createElement("ha-card");
    card.innerHTML = `
      <style>
        .pl-wrap { padding: 16px; }
        .pl-title { font-size: 1.2em; font-weight: 600; margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
        .pl-logo { height: 28px; width: auto; display: block; flex: none; }
        .pl-sub { margin-left: auto; font-size: 0.62em; font-weight: 400; color: var(--secondary-text-color); }
        .pl-row { display: grid; grid-template-columns: 1fr auto auto; align-items: center; gap: 12px; padding: 11px 0; border-top: 1px solid var(--divider-color); }
        .pl-name { display: flex; align-items: center; gap: 10px; min-width: 0; }
        .pl-name ha-icon { color: var(--secondary-text-color); --mdc-icon-size: 22px; flex: none; }
        .pl-pname { font-size: 0.95em; font-weight: 500; }
        .pl-trend { display: flex; align-items: flex-end; gap: 8px; }
        .pl-m { display: flex; flex-direction: column; align-items: flex-end; line-height: 1.15; }
        .pl-mval { font-size: 0.82em; color: var(--secondary-text-color); }
        .pl-mdate { font-size: 0.62em; color: var(--secondary-text-color); opacity: 0.8; }
        .pl-curline { display: flex; align-items: baseline; gap: 4px; }
        .pl-cur { font-size: 1.4em; font-weight: 700; }
        .pl-unit { font-size: 0.72em; color: var(--secondary-text-color); }
        .pl-arrow { --mdc-icon-size: 16px; align-self: center; }
        .pl-right { text-align: right; min-width: 88px; }
        .pl-pill { display: inline-block; font-size: 0.72em; font-weight: 600; padding: 3px 9px; border-radius: 9px; }
        .pl-target { font-size: 0.74em; color: var(--secondary-text-color); margin-top: 3px; }
        .pl-ok { color: #00b894; }
        .pl-warn { color: #e17055; }
        .pl-neutral { color: var(--primary-text-color); }
        .pl-pill-ok { background: rgba(0,184,148,0.15); color: #00b894; }
        .pl-pill-warn { background: rgba(225,112,85,0.15); color: #e17055; }
        .pl-pill-neutral { background: var(--secondary-background-color); color: var(--secondary-text-color); }
        .pl-unavailable { opacity: 0.4; }
      </style>
      <div class="pl-wrap">
        <div class="pl-title"><img class="pl-logo" alt="PoolLab" src="${PL_LOGO}" /><span id="pl-title-text"></span><span class="pl-sub" id="pl-sub"></span></div>
        <div id="pl-rows"></div>
      </div>
    `;
    this.appendChild(card);
  }

  _fmtDate(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    const months = plLocaleValue(this._hass, this._config, "months") || PL_LOCALES.en.months;
    return d.getDate() + " " + months[d.getMonth()];
  }

  _decimals(cfg, val) {
    if (cfg.decimals != null) return cfg.decimals;
    const v = Math.abs(val);
    if (v < 10) return 2;
    if (v < 100) return 1;
    return 0;
  }

  _num(v, dec) { return isFinite(v) ? plFormatNumber(v, this._hass, this._config, dec, dec) : String(v); }

  _clean(v) { return isFinite(v) ? plFormatNumber(Math.round(v * 1000) / 1000, this._hass, this._config, 0, 3) : String(v); }

  _fetchHistory() {
    const ids = this._config.entities.map((e) => e.entity).filter(Boolean);
    if (!ids.length) return;
    const now = Date.now();
    if (this._histBusy || now - (this._histAt || 0) < 600000) return;
    this._histBusy = true;
    this._hass.callWS({
      type: "history/history_during_period",
      start_time: new Date(now - 365 * 86400000).toISOString(),
      end_time: new Date(now).toISOString(),
      entity_ids: ids,
      minimal_response: false,
      no_attributes: false,
      significant_changes_only: false,
    }).then((resp) => {
      const out = {};
      for (const id of ids) {
        const states = (resp && resp[id]) || [];
        const seen = new Set();
        const list = [];
        for (let i = states.length - 1; i >= 0; i--) {
          const s = states[i];
          const a = s.a || {};
          const v = parseFloat(s.s);
          if (!isFinite(v) || v >= OVER_THRESHOLD || a.measure == null) continue;
          if (seen.has(a.measure)) continue;
          seen.add(a.measure);
          list.push({ value: v, measured_at: a.measured_at });
          if (list.length >= 4) break;
        }
        out[id] = list;
      }
      this._hist = out;
      this._histAt = Date.now();
      this._histBusy = false;
      if (this._built) this._update();
    }).catch(() => { this._histBusy = false; this._histAt = Date.now(); });
  }

  _measHtml(val, date, dec, cls) {
    const dateHtml = (this._config.show_date && date) ? "<span class=\"pl-mdate\">" + this._fmtDate(date) + "</span>" : "";
    return "<div class=\"pl-m\"><span class=\"" + (cls || "pl-mval") + "\">" + this._num(val, dec) + "</span>" + dateHtml + "</div>";
  }

  _rowHtml(cfg) {
    const st = this._state(cfg.entity);
    if (!st) {
      return "<div class=\"pl-row pl-unavailable\"><div class=\"pl-name\"><ha-icon icon=\"mdi:help-circle-outline\"></ha-icon><div class=\"pl-pname\">" + (cfg.name || cfg.entity) + "</div></div><div class=\"pl-trend\"><span class=\"pl-cur\">" + String.fromCharCode(8212) + "</span></div><div class=\"pl-right\"></div></div>";
    }
    const a = st.attributes;
    const name = cfg.name || plCleanName(st, this._hass, this._config);
    const icon = cfg.icon || a.icon || "mdi:water-percent";
    const unit = cfg.unit != null ? cfg.unit : (a.unit_of_measurement || "");
    const val = parseFloat(st.state);
    const over = isFinite(val) && val >= OVER_THRESHOLD;
    const N = this._config.measurements || 3;

    const targets = plTargets(cfg, a);
    const lo = targets.lo;
    const hi = targets.hi;

    const dec = this._decimals(cfg, isFinite(val) ? val : 0);
    let cls = "pl-neutral", pill = "", pillCls = "pl-pill-neutral", valTxt;
    if (over) {
      cls = "pl-warn"; pill = plT(this._hass, this._config, "over"); pillCls = "pl-pill-warn";
      const tmax = cfg.test_max != null ? cfg.test_max : (plTestMax(a.parameter) != null ? plTestMax(a.parameter) : hi);
      valTxt = tmax != null ? ("> " + this._clean(tmax)) : plT(this._hass, this._config, "over");
    } else {
      valTxt = isFinite(val) ? this._num(val, dec) : st.state;
      if (lo != null && val < lo) { cls = "pl-warn"; pill = plT(this._hass, this._config, "tooLow"); pillCls = "pl-pill-warn"; }
      else if (hi != null && val > hi) { cls = "pl-warn"; pill = plT(this._hass, this._config, "tooHigh"); pillCls = "pl-pill-warn"; }
      else if (lo != null || hi != null) { cls = "pl-ok"; pill = plT(this._hass, this._config, "ok"); pillCls = "pl-pill-ok"; }
    }

    const hist = (this._hist && this._hist[cfg.entity]) || [];
    const curDate = over ? a.measured_at : (hist[0] ? hist[0].measured_at : a.measured_at);

    let trendHtml = "";
    if (!over && N > 1) {
      const prevs = hist.slice(1, N).reverse();
      trendHtml += prevs.map((p) => this._measHtml(p.value, p.measured_at, dec, "pl-mval")).join("");
      if (cfg.trend !== false && hist.length >= 2 && Math.abs(val - hist[1].value) > 1e-9) {
        const prev1 = hist[1].value;
        let acls = "pl-mval";
        if (lo != null && hi != null) {
          const mid = (lo + hi) / 2;
          acls = Math.abs(val - mid) < Math.abs(prev1 - mid) ? "pl-ok" : "pl-warn";
        }
        trendHtml += "<ha-icon class=\"pl-arrow " + acls + "\" icon=\"" + (val > prev1 ? "mdi:arrow-top-right" : "mdi:arrow-bottom-right") + "\"></ha-icon>";
      }
    }

    const curDateHtml = (this._config.show_date && curDate) ? "<span class=\"pl-mdate\">" + this._fmtDate(curDate) + "</span>" : "";
    const unitHtml = (unit && !over) ? "<span class=\"pl-unit\">" + unit + "</span>" : "";
    const curHtml = "<div class=\"pl-m\"><div class=\"pl-curline\"><span class=\"pl-cur " + cls + "\">" + valTxt + "</span>" + unitHtml + "</div>" + curDateHtml + "</div>";

    let targetHtml = "";
    if (this._config.show_target !== false) {
      if (lo != null && hi != null) targetHtml = plT(this._hass, this._config, "target") + " " + this._clean(lo) + String.fromCharCode(8211) + this._clean(hi);
      else if (hi != null) targetHtml = plT(this._hass, this._config, "max") + " " + this._clean(hi);
      else if (lo != null) targetHtml = plT(this._hass, this._config, "min") + " " + this._clean(lo);
    }
    const pillHtml = pill ? "<span class=\"pl-pill " + pillCls + "\">" + pill + "</span>" : "";

    return "<div class=\"pl-row\">" +
      "<div class=\"pl-name\"><ha-icon icon=\"" + icon + "\"></ha-icon><div class=\"pl-pname\">" + name + "</div></div>" +
      "<div class=\"pl-trend\">" + trendHtml + curHtml + "</div>" +
      "<div class=\"pl-right\">" + pillHtml + (targetHtml ? "<div class=\"pl-target\">" + targetHtml + "</div>" : "") + "</div>" +
      "</div>";
  }

  _update() {
    if (!this._config) return;
    this.querySelector("#pl-title-text").textContent = this._config.title || "PoolLab";
    this._fetchHistory();

    const sub = this.querySelector("#pl-sub");
    const dates = this._config.entities
      .map((c) => { const st = this._state(c.entity); return st && st.attributes.measured_at; })
      .filter(Boolean).map((d) => new Date(d).getTime());
    if (this._config.show_date !== false && dates.length) {
      sub.textContent = plT(this._hass, this._config, "lastReading") + " " + this._fmtDate(new Date(Math.max(...dates)).toISOString());
    } else sub.textContent = "";

    this.querySelector("#pl-rows").innerHTML = this._config.entities.map((c) => this._rowHtml(c)).join("");
  }
}

class PoolLabCardEditor extends HTMLElement {
  setConfig(config) {
    const ents = (config.entities || []).map((e) => (typeof e === "string" ? { entity: e } : { ...e }));
    let m = parseInt(config.measurements, 10);
    if (!(m >= 1 && m <= 3)) m = 3;
    this._config = { title: "PoolLab", show_date: true, show_target: true, ...config, measurements: m, entities: ents };
    this._render();
  }
  set hass(hass) { this._hass = hass; this._render(); }

  _t(key) { return plT(this._hass, this._config, key); }

  _def(id) {
    const st = this._hass.states[id];
    const a = st ? st.attributes : {};
    const targets = plTargets({}, a);
    const lo = targets.lo;
    const hi = targets.hi;
    return { lo, hi, ic: a.icon || "mdi:water-percent" };
  }

  _sensorOptions() {
    const detected = Object.keys(this._hass.states).filter((e) => /^sensor\..*_pl_/.test(e));
    const ids = Array.from(new Set([...this._config.entities.map((e) => e.entity), ...detected]));
    return ids.map((id) => {
      const st = this._hass.states[id];
      return { value: id, label: st ? (st.attributes.friendly_name || id) : id };
    });
  }

  _render() {
    if (!this._hass || !this._config) return;
    const c = this._config;
    if (!this._form) {
      this.innerHTML = "";
      this._form = document.createElement("ha-form");
      this._form.computeLabel = (s) => s.label || s.name;
      this._form.addEventListener("value-changed", (ev) => {
        const v = ev.detail.value;
        const ids = v.entities || [];
        const prevMap = {};
        (c.entities || []).forEach((e) => { prevMap[e.entity] = e; });
        const ents = ids.map((id) => {
          const o = v[plKey(id)] || {};
          const old = prevMap[id] || {};
          const d = this._def(id);
          const r = { entity: id };
          if (o.name) r.name = o.name;
          if (o.icon && o.icon !== d.ic) r.icon = o.icon;
          const mn = o.min;
          if (mn != null && mn !== "" && !(d.lo != null && Math.abs(parseFloat(mn) - d.lo) < 1e-9)) r.min = mn;
          const mx = o.max;
          if (mx != null && mx !== "" && !(d.hi != null && Math.abs(parseFloat(mx) - d.hi) < 1e-9)) r.max = mx;
          if (o.trend === false) r.trend = false;
          if (old.unit != null) r.unit = old.unit;
          if (old.decimals != null) r.decimals = old.decimals;
          if (old.test_max != null) r.test_max = old.test_max;
          return r;
        });
        let m = parseInt(v.measurements, 10); if (!(m >= 1 && m <= 3)) m = 3;
        this._config = {
          ...this._config,
          title: v.title, language: v.language || undefined, measurements: m,
          show_date: v.show_date !== false, show_target: v.show_target !== false,
          entities: ents,
        };
        this._render();
        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config }, bubbles: true, composed: true }));
      });
      this.appendChild(this._form);
    }

    const data = {
      title: c.title, language: c.language || "", measurements: String(c.measurements || 3),
      show_date: c.show_date !== false, show_target: c.show_target !== false,
      entities: c.entities.map((e) => e.entity),
    };
    for (const e of c.entities) {
      const d = this._def(e.entity);
      data[plKey(e.entity)] = {
        icon: e.icon || d.ic,
        name: e.name || "",
        min: e.min != null ? e.min : (d.lo != null ? d.lo : ""),
        max: e.max != null ? e.max : (d.hi != null ? d.hi : ""),
        trend: e.trend !== false,
      };
    }

    const schema = [
      { name: "title", label: this._t("title"), selector: { text: {} } },
      { name: "language", label: this._t("language"), selector: { text: {} } },
      { name: "measurements", label: this._t("displayedMeasurements"), selector: { select: { mode: "dropdown", options: [
        { value: "1", label: this._t("latestOnly") },
        { value: "2", label: this._t("latestTwo") },
        { value: "3", label: this._t("latestThree") },
      ] } } },
      { name: "show_date", label: this._t("showMeasurementDates"), selector: { boolean: {} } },
      { name: "show_target", label: this._t("showTarget"), selector: { boolean: {} } },
      { name: "entities", label: this._t("poollabSensors"), selector: { select: { multiple: true, reorder: true, options: this._sensorOptions() } } },
    ];
    for (const e of c.entities) {
      const st = this._hass.states[e.entity];
      const title = e.name || (st ? plCleanName(st, this._hass, this._config) : e.entity);
      schema.push({
        type: "expandable", name: plKey(e.entity), title: title,
        schema: [
          { name: "icon", label: this._t("icon"), selector: { icon: {} } },
          { name: "name", label: this._t("displayName"), selector: { text: {} } },
          { name: "min", label: this._t("lowThreshold"), selector: { number: { mode: "box", step: "any" } } },
          { name: "max", label: this._t("highThreshold"), selector: { number: { mode: "box", step: "any" } } },
          { name: "trend", label: this._t("showTrend"), selector: { boolean: {} } },
        ],
      });
    }

    this._form.hass = this._hass;
    this._form.data = data;
    this._form.schema = schema;
  }
}

customElements.define("poollab-card", PoolLabCard);
customElements.define("poollab-card-editor", PoolLabCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "poollab-card", name: "PoolLab Card",
  description: "Water analysis card for the PoolLab integration: latest readings, previous measurements, value colored against its target, with OVER handling.",
  preview: true, documentationURL: "https://github.com/ADNPolymerase/poollab-card",
});
