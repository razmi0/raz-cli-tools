checkpoint:
	@git add -A
	@git commit -m "⏰ checkpoint : $$(date)"
	@git push
	@echo "checkpoint done!"