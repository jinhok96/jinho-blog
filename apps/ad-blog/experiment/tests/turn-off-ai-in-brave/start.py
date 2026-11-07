"""새 프로필로 Brave를 띄우고 그대로 둔다. 사용: /tmp/pw/bin/python start.py {프로필}"""
import sys
from common import run_brave
proc, url = run_brave(sys.argv[1])
print(proc.pid, url)
